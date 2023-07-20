/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  ButtonGroup,
  Zoom,
  Alert,
  FormControlLabel,
  Checkbox,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  tableCellClasses,
  styled,
  Tooltip,
  Collapse,
  CircularProgress
} from "@mui/material";
import { Add, AddOutlined, Cancel, Delete, Edit, ExpandLess, ExpandMore, Remove, Replay, Settings, Update } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from "../../../../websocket/socket";
import { withRouter } from "../../../../withRouter";
import CustomTable from "../../../../components/CustomTable";
import CustomModal from "../../../../components/CustomModal";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import GoBackButton from "../../../../components/GoBackButton";
import CustomCard from "../../../../components/CustomCard";
import CustomTextField from "../../../../components/CustomTextField";
import LoadingIcon from "../../../../components/LoadingIcon";
import { convertUpper } from "../../../../extras/functions";
import { timeLocale } from "../../../../objects/Time";
import theme from "../../../../theme";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};


const defaultStyles = {
  container: {
    backgroundColor: 'white',
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
  alertBox: {
    warning: {
      width: '100%',
      borderRadius: 0,
      color: palletes.alertWarning, // text color
      borderColor: palletes.alertWarning,
      my: '10px',
      py: "5px",
      px: "10px",
      '& .MuiAlert-icon': {
        color: palletes.alertWarning, // icon color
      },
    },
    success: {
      width: '100%',
      borderRadius: 0,
      color: palletes.alertSuccess, // text color
      borderColor: palletes.alertSuccess,
      my: '10px',
      py: "5px",
      px: "10px",
      '& .MuiAlert-icon': {
        color: palletes.alertSuccess, // icon color
      },
    }
  },
  colors: {
    headerTextColor: 'white',
    headerBackgroundColor: theme.palette.primary.main,
    rowTextColor: 'black',
    rowBackgroundColor: 'white',
    nthRowBackgroundColor: theme.palette.primary.light,
    footerTextColor: 'black',
    footerBackgroundColor: 'white',
  }
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: defaultStyles.colors.headerBackgroundColor,
    color: defaultStyles.colors.headerTextColor,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: defaultStyles.colors.rowBackgroundColor,
  '&:nth-of-type(odd)': {
    backgroundColor: defaultStyles.colors.nthRowBackgroundColor,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const stickyHeaderCell = {
  position: 'sticky',
  left: 0,
  zIndex: 800,
  background: defaultStyles.colors.headerBackgroundColor,
}

const stickyBodyCell = {
  position: 'sticky',
  left: 0,
  zIndex: 800,
  background: 'inherit'
}

class MisStudentCourseAttendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      semesterCourse: {},
      courseStudents: [],
      loading: true,
      callingApi: false,
      attendances: [],

      alertMsg: '',
      alertSeverity: 'warning',

      openDateTime: false,

      cancelClassModalOpen: false,
      cancelClassWeek: '',
      cancelClassIndex: -1,
      cancelClassRemarks: '',

      collapseOpen: false,
    };
    this.sem_course_id = this.props.location.state.sem_course_id
    this.timeoutAlertRef = null;
  }

  componentDidMount() {
    this.fetchData();
    socket.addEventListener('semestersCourses/listener/changed', this.changeListener)
    socket.addEventListener('studentsCourses/listener/changed', this.changeListener)
  }

  componentWillUnmount() {
    socket.removeEventListener('semestersCourses/listener/changed', this.changeListener)
    socket.removeEventListener('studentsCourses/listener/changed', this.changeListener)
  }

  changeListener = (data) => {
    if (data.sem_course_id == this.sem_course_id) this.fetchData()
  }

  fetchData = () => {
    this.setState({ loading: true })
    socket.emit("semestersCourses/fetch", { sem_course_id: this.sem_course_id }, (res) => {
      if (res.code == 200 && res.data.length == 1) {
        const semesterCourse = res.data[0];
        socket.emit("studentsCourses/fetch", { sem_course_id: this.sem_course_id }, (res) => {
          if (res.code == 200) {
            return this.setState({
              semesterCourse: semesterCourse,
              courseStudents: res.data.filter(o => o.grade != 'W'),
            }, () => this.generateAttendances(() => this.setState({ loading: false })));
          }
        });
      }
    });
  }

  generateAttendances = (callback) => {
    const attendances = []

    const attendance_obj = {}

    this.state.courseStudents.map(studentCourse => {
      if (studentCourse.attendance) {
        Object.keys(studentCourse.attendance).filter(k => k.startsWith('week')).forEach((week) => {
          if (!attendance_obj[week]) attendance_obj[week] = {classes: []}
          studentCourse.attendance[week].classes.forEach((weekClass, c_index) => {
            if (!attendance_obj[week].classes[c_index]) attendance_obj[week].classes[c_index] = {...weekClass, attendance: ""}
          })
        })
      }
    })

    this.state.courseStudents.map(studentCourse => {
      const inner_attendance_obj = JSON.parse(JSON.stringify(attendance_obj))
      const obj = {
        student_batch_id: studentCourse.student_batch_id,
        ...inner_attendance_obj
      }
      Object.keys(studentCourse.attendance).filter(k => k.startsWith('week')).forEach((week, index) => {
        studentCourse.attendance[week].classes.forEach((weekClass, c_index) => {
          obj[week].classes[c_index].attendance = weekClass.attendance
        })
      })
      attendances.push(obj)
    })

    console.log('generateAttendances', attendances)
    this.setState({
      attendances: [...attendances]
    }, () => callback ? callback() : null)
  }

  timeoutAlert = () => {
    console.log('timeoutAlert called')
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 5000)
  }

  render() {
    return (
      <Grid container>
        {this.state.loading ? <LoadingIcon /> :
          <CustomCard>
            <Grid container style={{ padding: '10px' }}>
              <Grid item xs={'auto'}>
                <Typography variant="h3">
                  Students Attendance
                </Typography>
              </Grid>
              <Grid item xs={'auto'}>
                <IconButton onClick={() => this.setState((state) => ({ collapseOpen: !state.collapseOpen }))}>
                  {this.state.collapseOpen ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Grid>
            </Grid>
            <Collapse in={this.state.collapseOpen}>
              <Grid container spacing={1} style={{ padding: '10px' }}>
                <Grid key={`griditem-1`} item xs={12}>
                  <TableContainer>
                    <Table size="small">
                      {/* Headers */}
                      <TableHead>
                        <StyledTableRow>
                          <StyledTableCell key={`tablecell-header-0`} align="left">
                            Reg #
                          </StyledTableCell>
                          <StyledTableCell key={`tablecell-header-1`} align="left" style={stickyHeaderCell}>
                            Student Name
                          </StyledTableCell>
                          <StyledTableCell key={`tablecell-header-2`} align="left">
                            %age
                          </StyledTableCell>
                          {Object.keys(this.state.attendances[0] || []).filter(k => k.startsWith('week')).map((week, index) => {
                            return (
                              <StyledTableCell colSpan={this.state.attendances?.[0][week].classes.length} align='center' sx={{ borderLeft: 1 }}>
                                {`Week ${week.split('week')[1]}`}
                              </StyledTableCell>
                            )
                          })}
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell></StyledTableCell>
                          <StyledTableCell style={stickyHeaderCell}></StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                          {Object.keys(this.state.attendances[0] || []).filter(k => k.startsWith('week')).map((week, index) => {
                            return this.state.attendances?.[0][week].classes.map((weekClass, index) => {
                              return (
                                <StyledTableCell align='center' sx={{ borderLeft: 1 }}>
                                  {`C${index + 1} (${new Date(weekClass.timestamp).toLocaleDateString()})`}
                                </StyledTableCell>
                              )
                            })
                          })}
                        </StyledTableRow>
                      </TableHead>
                      {/* Rows */}
                      <TableBody>
                        {this.state.courseStudents.map((student, studentsIndex) => {
                          var classesCounter = -1
                          return (
                            <StyledTableRow>
                              <StyledTableCell key={`tablecell-0`} component="th" scope="row">
                                {student.reg_no || student.cnic}
                              </StyledTableCell>
                              <StyledTableCell key={`tablecell-1`} align="left" style={stickyBodyCell}>{student.student_name}</StyledTableCell>
                              <StyledTableCell key={`tablecell-2`} align="left">{student.attendance.percentage || 0}%</StyledTableCell>
                              {Object.keys(this.state.attendances[0] || {}).filter(k => k.startsWith('week')).map((attribute, weekIndex, clas) => {
                                return this.state.attendances.filter(attendance => attendance.student_batch_id == student.student_batch_id)[0][`week${weekIndex + 1}`].classes.map((weekClass, classIndex) => {
                                  weekClass.cancelled ? classesCounter += 0 : classesCounter += 1;
                                  return (
                                    weekClass.cancelled ?
                                      studentsIndex != 0 ? <></> :
                                        <StyledTableCell align='center' rowSpan={this.state.attendances.length} sx={{ transform: 'rotate(-90deg)', color: Color.red[500] }}>
                                          {weekClass.remarks}
                                        </StyledTableCell>
                                      :
                                      <StyledTableCell align='center'>
                                        <TextField
                                          // inputRef={(ref) => (this.inputRefs.current[(studentsIndex+1) + (weekIndex*this.state.courseStudents.length)] = ref)} 
                                          InputProps={{ readOnly: true, inputProps: { tabIndex: (studentsIndex + 1) + (classesCounter * this.state.courseStudents.length) } }}
                                          autoComplete="off"
                                          key={`input-${(studentsIndex + 1) + (classesCounter * this.state.courseStudents.length)}`}
                                          onFocus={(e) => e.target.select()}
                                          value={weekClass.attendance}
                                          sx={{ '.MuiInputBase-input': { fontSize: '15px' }, width: '40px' }}
                                          type="tel" size="small" />
                                      </StyledTableCell>

                                  )
                                })
                              })
                              }
                            </StyledTableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid key={`griditem-2`} item xs={12}>
                  <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                    <Alert variant="outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                  </Zoom>
                </Grid>
              </Grid>
            </Collapse>
          </CustomCard>
        }
      </Grid>
    );
  }
}

export default withRouter(MisStudentCourseAttendance);

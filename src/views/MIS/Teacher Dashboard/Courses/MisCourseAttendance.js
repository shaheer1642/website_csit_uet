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
import CustomButton from "../../../../components/CustomButton";
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

class MisCourseAttendance extends React.Component {
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

      showSettings: false,

      openDateTime: false,

      cancelClassModalOpen: false,
      cancelClassWeek: '',
      cancelClassIndex: -1,
      cancelClassRemarks: '',

      collapseOpen: false,
    };
    this.sem_course_id = this.props.location.state.sem_course_id
    this.student_view = this.props.user.user_type == 'student'
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
    if (data.sem_course_id == this.sem_course_id)
      this.fetchData()
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

  addWeek = () => {
    const attendances = this.state.attendances
    attendances.forEach((obj, index) => {
      attendances[index][`week${Object.keys(obj).filter(k => k.startsWith('week')).length + 1}`] = {
        classes: [{
          attendance: '',
          remarks: '',
          cancelled: false,
          timestamp: new Date().getTime()
        }]
      }
    })
    console.log('addWeek', attendances)
    this.setState({
      attendances: [...attendances],
    })
  }

  removeLastWeek = () => {
    const attendances = this.state.attendances
    attendances.forEach((obj, index) => {
      delete attendances[index][`week${Object.keys(obj).filter(k => k.startsWith('week')).length}`]
    })
    this.setState({
      attendances: [...attendances],
    })
  }

  editWeekClassDate = (week, classIndex, newTimestamp) => {
    console.log('editWeekClassDate', week, classIndex, newTimestamp)
    const attendances = this.state.attendances
    attendances.forEach((obj, index) => {
      attendances[index][week].classes[classIndex].timestamp = newTimestamp
    })
    this.setState({
      attendances: [...attendances],
    })
  }

  resetWeekClass = (week, classIndex) => {
    const attendances = this.state.attendances
    attendances.forEach((obj, index) => {
      attendances[index][week].classes[classIndex] = {
        attendance: '',
        remarks: '',
        cancelled: false,
        timestamp: new Date().getTime()
      }
    })
    this.setState({
      attendances: [...attendances],
    })
  }

  cancelWeekClass = () => {
    const attendances = this.state.attendances
    const week = this.state.cancelClassWeek
    const classIndex = this.state.cancelClassIndex
    attendances.forEach((obj, index) => {
      attendances[index][week].classes[classIndex].cancelled = true
      attendances[index][week].classes[classIndex].remarks = this.state.cancelClassRemarks
    })
    this.setState({
      attendances: [...attendances],
      cancelClassIndex: -1,
      cancelClassWeek: '',
      cancelClassModalOpen: false
    })
  }

  addClassInWeek = (week) => {
    const attendances = this.state.attendances
    attendances.forEach((obj, index) => {
      attendances[index][week].classes.push({
        attendance: '',
        remarks: '',
        cancelled: false,
        timestamp: new Date().getTime()
      })
    })
    this.setState({
      attendances: [...attendances],
    })
  }

  removeClassInWeek = (week, classIndex) => {
    if (classIndex == 0) return
    console.log('removeClassInWeek', week, classIndex)
    const attendances = this.state.attendances
    attendances.forEach((obj, index) => {
      attendances[index][week].classes = attendances[index][week].classes.filter((o, i) => i != classIndex)
    })
    this.setState({
      attendances: [...attendances],
    })
  }

  generateAttendances = (callback) => {
    const attendances = []

    const attendance_obj = {}

    this.state.courseStudents.map(studentCourse => {
      if (studentCourse.attendance) {
        Object.keys(studentCourse.attendance).filter(k => k.startsWith('week')).forEach((week) => {
          if (!attendance_obj[week]) attendance_obj[week] = { classes: [] }
          studentCourse.attendance[week].classes.forEach((weekClass, c_index) => {
            if (!attendance_obj[week].classes[c_index]) attendance_obj[week].classes[c_index] = { ...weekClass, attendance: "" }
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

  updateStudentAttendace = (week, classIndex, student_batch_id, value) => {
    console.log('updateStudentAttendace', week, classIndex, student_batch_id, value)
    value = value.toUpperCase()
    if (value != 'A' && value != 'P' && value != 'L') return
    const attendances = this.state.attendances
    attendances.forEach((obj, index) => {
      if (attendances[index].student_batch_id == student_batch_id) {
        attendances[index][week].classes[classIndex].attendance = value
      }
    })
    this.setState({
      attendances: [...attendances],
    })
  }

  timeoutAlert = () => {
    console.log('timeoutAlert called')
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 5000)
  }

  settingsActions = () => {
    return (
      <React.Fragment>
        <Grid item xs={"auto"}>
          <CustomButton
            color='success'
            label="Add Week"
            variant="outlined"
            startIcon={<Add />}
            onClick={this.addWeek}
          />
        </Grid>
        <Grid item xs={"auto"}>
          <CustomButton
            color='error'
            label="Remove Last Week"
            variant="outlined"
            startIcon={<Remove />}
            onClick={this.removeLastWeek}
          />
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={"auto"}>
          <CustomButton
            label={this.state.callingApi ? <CircularProgress size='20px' /> : "Save Changes"}
            disabled={this.state.callingApi}
            onClick={() => {
              this.setState({ callingApi: true })
              socket.emit(`studentsCourses/updateAttendances`, { sem_course_id: this.sem_course_id, attendances: this.state.attendances }, res => {
                this.setState({
                  alertMsg: res.code == 200 ? 'Updated students attendance' : `${res.status}: ${res.message}`,
                  alertSeverity: res.code == 200 ? 'success' : 'warning',
                  showSettings: false,
                  callingApi: false
                }, this.timeoutAlert)
              })
            }}
          />
        </Grid>
        <Grid item xs={"auto"}>
          <CustomButton
            variant='outlined'
            label="Cancel"
            onClick={() => {
              this.fetchData()
              this.setState({ showSettings: false })
            }}
          />
        </Grid>
      </React.Fragment>
    )
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon /> :
        <CustomCard>
          <Grid container spacing={2}>
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
            <Grid item xs={12}>
              <Collapse in={this.state.collapseOpen}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table size="small">
                        {/* Headers */}
                        <TableHead>
                          <StyledTableRow>
                            <StyledTableCell align="left"> Reg # </StyledTableCell>
                            <StyledTableCell align="left" style={stickyHeaderCell}> Student Name </StyledTableCell>
                            <StyledTableCell align="left"> %age </StyledTableCell>
                            {Object.keys(this.state.attendances[0] || []).filter(k => k.startsWith('week')).map((week, index) => {
                              return (
                                <StyledTableCell key={index} colSpan={this.state.attendances?.[0][week].classes.length} align='center' sx={{ borderLeft: 1 }}>
                                  {`Week ${week.split('week')[1]}`}
                                  {this.state.showSettings ?
                                    <Tooltip title='Add class'>
                                      <IconButton sx={{ color: 'secondary.light' }} onClick={() => this.addClassInWeek(`week${index + 1}`)}><AddOutlined /></IconButton>
                                    </Tooltip> : <></>
                                  }
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
                                  <StyledTableCell key={index} align='center' sx={{ borderLeft: 1 }}>
                                    {`C${index + 1} (${new Date(weekClass.timestamp).toLocaleDateString()})`}
                                    {this.state.showSettings ?
                                      <React.Fragment>
                                        <TextField
                                          type='date'
                                          onChange={(e) => {
                                            this.editWeekClassDate(week, index, new Date(e.target.value).getTime())
                                          }}
                                          sx={{ color: 'secondary.light', width: '46px' }}
                                        />
                                        <CustomButton
                                          sx={{ color: 'secondary.light', borderColor: 'secondary.light', fontSize: '10px' }}
                                          variant='outlined'
                                          label="Cancel Class"
                                          disabled={weekClass.cancelled}
                                          onClick={() => this.setState({ cancelClassModalOpen: true, cancelClassWeek: week, cancelClassIndex: index })}
                                        />
                                        <Tooltip title='Reset class'>
                                          <IconButton onClick={() => this.resetWeekClass(week, index)}>
                                            <Replay />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Remove class'>
                                          <span>
                                            <IconButton onClick={() => this.removeClassInWeek(week, index)} disabled={index == 0 ? true : false}>
                                              <Cancel />
                                            </IconButton>
                                          </span>
                                        </Tooltip>
                                      </React.Fragment> : <></>
                                    }
                                  </StyledTableCell>
                                )
                              })
                            })}
                          </StyledTableRow>
                        </TableHead>
                        {/* Rows */}
                        {this.state.showSettings ? <></> :
                          <TableBody>
                            {(this.student_view ? this.state.courseStudents.filter(s => s.student_id == this.props.user.user_id) : this.state.courseStudents).map((student, studentsIndex) => {
                              var classesCounter = -1
                              return (
                                <StyledTableRow key={studentsIndex}>
                                  <StyledTableCell component="th" scope="row">
                                    {student.reg_no || student.cnic}
                                  </StyledTableCell>
                                  <StyledTableCell align="left" style={stickyBodyCell}>{student.student_name}</StyledTableCell>
                                  <StyledTableCell align="left">{student.attendance.percentage || 0}%</StyledTableCell>
                                  {Object.keys(this.state.attendances[0] || {}).filter(k => k.startsWith('week')).map((attribute, weekIndex, clas) => {
                                    return this.state.attendances.filter(attendance => attendance.student_batch_id == student.student_batch_id)[0][`week${weekIndex + 1}`].classes.map((weekClass, classIndex) => {
                                      weekClass.cancelled ? classesCounter += 0 : classesCounter += 1;
                                      return (
                                        weekClass.cancelled ?
                                          studentsIndex != 0 ? <React.Fragment key={classIndex}></React.Fragment> :
                                            <StyledTableCell key={classIndex} align='center' rowSpan={this.state.attendances.length} sx={{ transform: 'rotate(-90deg)', color: Color.red[500] }}>
                                              {weekClass.remarks}
                                            </StyledTableCell>
                                          :
                                          <StyledTableCell key={classIndex} align='center'>
                                            <TextField
                                              disabled={this.state.semesterCourse.grades_locked || this.student_view}
                                              // inputRef={(ref) => (this.inputRefs.current[(studentsIndex+1) + (weekIndex*this.state.courseStudents.length)] = ref)} 
                                              InputProps={{ inputProps: { tabIndex: (studentsIndex + 1) + (classesCounter * this.state.courseStudents.length) } }}
                                              autoComplete="off"
                                              key={`input-${(studentsIndex + 1) + (classesCounter * this.state.courseStudents.length)}`}
                                              onFocus={(e) => e.target.select()}
                                              value={weekClass.attendance}
                                              onChange={(e) => this.updateStudentAttendace(`week${weekIndex + 1}`, classIndex, student.student_batch_id, e.target.value)}
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
                          </TableBody>}
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12}>
                    <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                      <Alert variant="outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                    </Zoom>
                  </Grid>
                  {this.state.semesterCourse.grades_locked || this.student_view ? <></> :
                    this.state.showSettings ? this.settingsActions() :
                      <React.Fragment>
                        <Grid item xs={"auto"}>
                          <CustomButton
                            label={this.state.callingApi ? <CircularProgress size='20px' /> : "Save"}
                            disabled={this.state.callingApi}
                            onClick={() => {
                              this.setState({ callingApi: true })
                              socket.emit(`studentsCourses/updateAttendances`, { sem_course_id: this.sem_course_id, attendances: this.state.attendances }, res => {
                                this.setState({ callingApi: false })
                                this.setState({
                                  alertMsg: res.code == 200 ? 'Updated students attendance' : `${res.status}: ${res.message}`,
                                  alertSeverity: res.code == 200 ? 'success' : 'warning'
                                }, this.timeoutAlert)
                              })
                            }}
                          />
                        </Grid>
                        <Grid item xs={"auto"}>
                          <CustomButton
                            label="Reset"
                            onClick={() => this.fetchData()}
                          />
                        </Grid>
                        <Grid item xs={"auto"}>
                          <CustomButton
                            startIcon={<Settings />}
                            label="Settings"
                            variant="outlined"
                            onClick={() => this.setState({ showSettings: true })}
                          />
                        </Grid>
                      </React.Fragment>
                  }
                </Grid>
              </Collapse>
            </Grid>
            <CustomModal open={this.state.cancelClassModalOpen}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography>{`Reason for cancelling ${this.state.cancelClassWeek} class${this.state.cancelClassIndex + 1}`}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField variant="filled" onChange={(e) => this.setState({ cancelClassRemarks: e.target.value })} />
                </Grid>
                <Grid item xs={'auto'}>
                  <CustomButton label="OK" onClick={() => this.cancelWeekClass()} />
                </Grid>
                <Grid item xs={'auto'}>
                  <CustomButton label="Cancel" onClick={() => this.setState({ cancelClassRemarks: '', cancelClassModalOpen: false })} />
                </Grid>
              </Grid>
            </CustomModal>
          </Grid>
        </CustomCard>
    );
  }
}

export default withRouter(MisCourseAttendance);

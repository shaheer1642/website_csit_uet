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
  styled
} from "@mui/material";
import { Delete, Edit } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from "../../../../websocket/socket";
import { withRouter } from "../../../../withRouter";
import CustomTable from "../../../../components/CustomTable";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import GoBackButton from "../../../../components/GoBackButton";
import { user } from "../../../../objects/User";
import CustomCard from "../../../../components/CustomCard";
import CustomTextField from "../../../../components/CustomTextField";
import LoadingIcon from "../../../../components/LoadingIcon";
import { convertUpper } from "../../../../extras/functions";

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
      width:'100%', 
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
      width:'100%', 
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
    headerBackgroundColor:Color.deepPurple[500],
    rowTextColor: 'black',
    rowBackgroundColor: 'white',
    nthRowBackgroundColor: Color.deepPurple[100],
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
      courseStudents: [],
      loading: true,
      attendances: [],

      alertMsg: '',
      alertSeverity: 'warning'
      
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
    if (data.sem_course_id == this.sem_course_id)
      this.fetchData()
  }

  generateAttendances = () => {
    const attendances = []
    this.state.courseStudents.map(student => {
      const obj = {
        student_id: student.student_id,
      }
      Array(16).fill(0).forEach((e,index) => {
        obj[`week${index+1}`] = student.attendance[`week${index+1}`] || ''
      })
      attendances.push(obj)
    })
    console.log('generateAttendances',attendances)
    this.setState({
      attendances: [...attendances],
      loading: false
    })
  }

  updateStudentAttendace = (key,student_id,value) => {
    value = value.toUpperCase()
    if (value != 'A' && value != 'P' && value != 'L') return
    const attendances = this.state.attendances.map(attendance => {
      if (student_id != attendance.student_id) return attendance
      else return {
        ...attendance, 
        [key]: value
      }
    })
    console.log(attendances)
    this.setState({
      attendances: [...attendances]
    })
  }

  fetchData = () => {
    this.setState({
      loading: true
    }, () => {
      socket.emit("studentsCourses/fetch", {sem_course_id: this.sem_course_id}, (res2) => {
        if (res2.code == 200) {
          return this.setState({
            courseStudents: res2.data,
          }, () => this.generateAttendances());
        }
      });
    })
  }

  timeoutAlert = () => {
    console.log('timeoutAlert called')
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({alertMsg: ''}), 5000)
  }

  render() {
    return (
      <Grid container>
        {this.state.loading ? <LoadingIcon /> :
          <CustomCard
            cardContent={
              <Grid container rowSpacing={"20px"} columnSpacing={"20px"} style={{padding: '10px'}}>
                <Grid key={`griditem-0`} item xs={12}>
                  <Typography variant="h3">
                    Students Attendance
                  </Typography>
                </Grid>
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
                          {Array(16).fill(0).map((e,index) => {
                            return (
                              <StyledTableCell key={`tablecell-header-${index + 4}`} align="center" >
                                {`Week ${index + 1}`}
                              </StyledTableCell>
                            )
                          })}
                        </StyledTableRow>
                      </TableHead>
                      {/* Rows */}
                      <TableBody>
                      {this.state.courseStudents.map((student,index) => {
                        return (
                          <StyledTableRow
                            key={`tablerow-${index}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <StyledTableCell key={`tablecell-0`} component="th" scope="row">
                              {student.reg_no || student.cnic}
                            </StyledTableCell>
                            <StyledTableCell key={`tablecell-1`} align="left" style={stickyBodyCell}>{student.student_name}</StyledTableCell>
                            <StyledTableCell key={`tablecell-2`} align="left">{student.attendance.percentage || 0}%</StyledTableCell>
                            {Array(16).fill(0).map((attribute,index) => {
                              return (
                                <StyledTableCell key={`tablecell-${index + 4}`} align="center">
                                  {index == 7 || index == 15 ? <></>:
                                  <TextField 
                                    autoComplete="off"
                                    key={`input-${student.student_id}-${index}`}
                                    onFocus={(e) => e.target.select()} 
                                    value={this.state.attendances.filter(attendance => attendance.student_id == student.student_id)[0][`week${index+1}`]} 
                                    onChange={(e) => this.updateStudentAttendace(`week${index+1}`,student.student_id,e.target.value)} 
                                    sx={{'.MuiInputBase-input': { fontSize: '15px' }, width: '40px'}} 
                                    type="tel" size="small"/>}
                                </StyledTableCell>
                              )
                            })}
                          </StyledTableRow>
                        )
                      })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid key={`griditem-2`} item xs={12}>
                  <Zoom in={this.state.alertMsg == '' ? false:true} unmountOnExit mountOnEnter>
                    <Alert variant= "outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                  </Zoom>
                </Grid>
                <Grid key={`griditem-3`} item xs={"auto"}>
                  <CustomButton 
                    label="Save"
                    onClick={() => {
                      socket.emit(`studentsCourses/updateAttendances`, {sem_course_id: this.sem_course_id, attendances: this.state.attendances}, res => {
                        console.log(res)
                        this.setState({
                          alertMsg: res.code == 200 ? 'Updated students attendance':`${res.status}: ${res.message}`,
                          alertSeverity: res.code == 200 ? 'success':'warning'
                        }, this.timeoutAlert)
                      })
                    }}
                  />
                </Grid>
                <Grid key={`griditem-4`} item xs={"auto"}>
                  <CustomButton 
                    label="Reset"
                    onClick={() => this.fetchData()}
                  />
                </Grid>
              </Grid>
            }
          ></CustomCard>
        }
      </Grid>
    );
  }
}

export default withRouter(MisCourseAttendance);

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
  TextField
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
  }
}

class MisGradeMarking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      semesterCourse: {},
      courseStudents: [],
      loading: true,
      markings: [],

      alertMsg: '',
      alertSeverity: 'warning'
      
    };
    this.sem_course_id = this.props.location.state.sem_course_id
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

  generateMarkings = () => {
    const markings = []
    this.state.courseStudents.map(student => {
      const obj = {
        student_id: student.student_id,
        finals: {
          total: 50,
          obtained: 0
        },
        mids: {
          total: 20,
          obtained: 0
        },
      }
      if (this.state.semesterCourse.grade_distribution.mini_project) {
        obj.mini_project = {
          total: 20,
          obtained: 0
        }
      }
      Array(this.state.semesterCourse.grade_distribution.total_assignments).fill(0).forEach((e,index) => {
        obj[`assignment ${index + 1}`] = {
          total: 5,
          obtained: 0
        }
      })
      Array(this.state.semesterCourse.grade_distribution.total_quizzes).fill(0).forEach((e,index) => {
        obj[`quiz ${index + 1}`] = {
          total: 5,
          obtained: 0
        }
      })
      markings.push(obj)
    })
    this.setState({
      markings: [...markings]
    })
  }

  updateMarkingsTotal = (key,value) => {
    if (!Number(value)) return
    const markings = this.state.markings.map(marking => {
      return {
        ...marking, 
        [key]: { 
          ...marking[key], 
          total: Number(value)
        }
      }
    })
    console.log(markings)
    this.setState({
      markings: [...markings]
    })
  }

  updateStudentMarking = (key,student_id,value) => {
    if (!Number(value)) return
    const markings = this.state.markings.map(marking => {
      if (student_id != marking.student_id) return marking
      else  return {
        ...marking, 
        [key]: { 
          ...marking[key], 
          obtained: Number(value)
        }
      }
    })
    console.log(markings)
    this.setState({
      markings: [...markings]
    })
  }

  fetchData = () => {
    this.setState({
      loading: true
    }, () => {
      socket.emit("semestersCourses/fetch", {sem_course_id: this.sem_course_id}, (res1) => {
        if (res1.code == 200) {
          socket.emit("studentsCourses/fetch", {sem_course_id: this.sem_course_id}, (res2) => {
            if (res2.code == 200) {
              return this.setState({
                semesterCourse: res1.data[0],
                courseStudents: res2.data,
                loading: false,
              }, () => this.generateMarkings());
            }
          });
        }
      });
    })
  }

  render() {
    var timeoutAlertRef = null;
    function timeoutAlert() {
      console.log('timeoutAlert called')
      clearTimeout(timeoutAlertRef)
      timeoutAlertRef = setTimeout(() => this.setState({alertMsg: ''}), 5000)
      console.log(timeoutAlertRef)
    }

    return (
      <Grid container>
        {this.state.loading ? <LoadingIcon /> :
        <React.Fragment>
          <Grid item xs={12}>
            <Zoom in={this.state.alertMsg == '' ? false:true} unmountOnExit mountOnEnter>
              <Alert variant= "outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
            </Zoom>
          </Grid>
          <CustomCard
            cardContent={
              <Grid container rowSpacing={"20px"} columnSpacing={"20px"}>
                <Grid item xs={12}>
                  <Typography variant="h3">
                    Students Marking
                  </Typography>
                </Grid>
                <Grid item xs={12}>

                  <TableContainer sx={{ borderColor: Color.orange[700], border: 3, padding: '20px' }}>
                    <Table size="small">
                      {/* Headers */}
                      <TableHead>
                        <TableRow>
                          {['Registration no','Student name'].concat().map((header,index) => {
                            return (
                              <TableCell align="left" >
                                {header}
                              </TableCell>
                            )
                          })}
                          {Object.keys(this.state.markings[0] || {}).filter(key => !['student_id'].includes(key)).map((attribute) => {
                            return (
                              <TableCell align="left" width={"200px"}>
                                <Grid container>
                                  <Grid item xs={12}>
                                    <Typography style={{ fontSize: '15px'}}>
                                      {attribute}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={"auto"} alignItems="center">
                                    <Typography style={{ fontSize: '15px', marginTop: '5px'}}>Total:</Typography>
                                  </Grid>
                                  <Grid item xs={"auto"}>
                                  <TextField onFocus={(e) => e.target.select()} value={this.state.markings[0][attribute].total} onChange={(e) => this.updateMarkingsTotal(attribute,e.target.value)} sx={{'.MuiInputBase-input': { fontSize: '15px' }, width: '50px'}} type="tel" size="small"/>
                                  </Grid>
                                </Grid>
                              </TableCell>

                            )
                          })}
                        </TableRow>
                      </TableHead>
                      {/* Rows */}
                      <TableBody>
                      {this.state.courseStudents.map((student,index) => {
                        return (
                          <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {student.reg_no || student.cnic}
                            </TableCell>
                            <TableCell align="left">{student.student_name}</TableCell>
                            {Object.keys(this.state.markings[0] || {}).filter(key => !['student_id'].includes(key)).map((attribute) => {
                              return (
                                <TableCell align="left">
                                  <TextField 
                                    onFocus={(e) => e.target.select()} 
                                    value={this.state.markings.filter(marking => marking.student_id == student.student_id)[0][attribute].obtained} 
                                    onChange={(e) => this.updateStudentMarking(attribute,student.student_id,e.target.value)} sx={{'.MuiInputBase-input': { fontSize: '15px' }, width: '50px'}} 
                                    type="tel" size="small"/>
                                </TableCell>

                              )
                            })}
                          </TableRow>
                        )
                      })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={"auto"}>
                  <CustomButton 
                    label="Save"
                    onClick={() => {}}
                  />
                </Grid>
                <Grid item xs={"auto"}>
                  <CustomButton 
                    label="Reset"
                    onClick={() => this.fetchData()}
                  />
                </Grid>
              </Grid>
            }
          ></CustomCard>
        </React.Fragment>
        }
      </Grid>
    );
  }
}

export default withRouter(MisGradeMarking);

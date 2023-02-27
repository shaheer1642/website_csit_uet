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

  generateMarkings = () => {
    const markings = []
    this.state.courseStudents.map(student => {
      const obj = {
        student_id: student.student_id,
        final_term: student.marking.final_term || 0,
        mid_term: student.marking.mid_term || 0,
      }
      Object.keys(this.state.semesterCourse.grade_distribution.sessional.division).map(key => {
        const value = this.state.semesterCourse.grade_distribution.sessional.division[key]
        if (value.include) {
          if (key == 'assignments') {
            Array(value.no_of_assignments).fill(0).forEach((e,index) => {
              obj[`assignment_${index + 1}`] = student.marking[`assignment_${index + 1}`] || 0
            })
          } else if (key == 'quizzes') {
            Array(value.no_of_quizzes).fill(0).forEach((e,index) => {
              obj[`quiz_${index + 1}`] = student.marking[`quiz_${index + 1}`] || 0
            })
          } else {
            obj[key] = student.marking[key] || 0
          }
        }
      })
      markings.push(obj)
    })
    this.setState({
      markings: [...markings]
    })
  }

  updateStudentMarking = (key,student_id,value) => {
    const marks = Number(value)
    if (marks == NaN || marks < 0) return
    const grade_distribution = this.state.semesterCourse.grade_distribution
    const total_marks = (key == 'final_term') ? grade_distribution.final_term.total_marks :
                        (key == 'mid_term') ? grade_distribution.mid_term.total_marks :
                        (key.match('assignment')) ? grade_distribution.sessional.division.assignments.total_marks_per_assignment :
                        (key.match('quiz')) ? grade_distribution.sessional.division.quizzes.total_marks_per_quiz :
                        grade_distribution.sessional.division[key].total_marks
    if (!total_marks || marks > total_marks) return
    const markings = this.state.markings.map(marking => {
      if (student_id != marking.student_id) return marking
      else return {
        ...marking, 
        [key]: marks
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
                    Students Marking
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
                            Result ({this.state.semesterCourse.grade_distribution.marking.type})
                          </StyledTableCell>
                          <StyledTableCell key={`tablecell-header-3`} align="left">
                            Estimated Grade
                          </StyledTableCell>
                          {Object.keys(this.state.markings[0] || {}).filter(key => key != 'student_id').map((attribute,index) => {
                            return (
                              <StyledTableCell key={`tablecell-header-${index + 4}`} align="center" >
                                {convertUpper(attribute)}
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
                            <StyledTableCell key={`tablecell-2`} align="left">{`${student.marking.result?.[this.state.semesterCourse.grade_distribution.marking.type]?.obtained_marks || 0}/${student.marking.result?.[this.state.semesterCourse.grade_distribution.marking.type]?.total_marks || 0} (${student.marking.result?.[this.state.semesterCourse.grade_distribution.marking.type]?.percentage || 0}%)`}</StyledTableCell>
                            <StyledTableCell key={`tablecell-3`} align="left">{student.marking.result?.[this.state.semesterCourse.grade_distribution.marking.type]?.grade}</StyledTableCell>
                            {Object.keys(this.state.markings[0] || {}).filter(key => key != 'student_id').map((attribute,index) => {
                              return (
                                <StyledTableCell key={`tablecell-${index + 4}`} align="center">
                                  {attribute == 'attendance' ? this.state.markings.filter(marking => marking.student_id == student.student_id)[0][attribute]:
                                  <TextField 
                                    key={`input-${student.student_id}-${index}`}
                                    onFocus={(e) => e.target.select()} 
                                    value={this.state.markings.filter(marking => marking.student_id == student.student_id)[0][attribute]} 
                                    onChange={(e) => this.updateStudentMarking(attribute,student.student_id,e.target.value)} 
                                    sx={{'.MuiInputBase-input': { fontSize: '15px' }, width: '50px'}} 
                                    type="tel" size="small"/>
                                  }
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
                      socket.emit(`studentsCourses/updateMarkings`, {sem_course_id: this.sem_course_id, markings: this.state.markings}, res => {
                        console.log(res)
                        this.setState({
                          alertMsg: res.code == 200 ? 'Updated student markings':`${res.status}: ${res.message}`,
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

export default withRouter(MisGradeMarking);
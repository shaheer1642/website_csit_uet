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
  Checkbox
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

class MisGradeDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      semesterCourse: {},
      loadingSemesterCourse: true,

      alertMsg: '',
      alertSeverity: 'warning'
      
    };
    this.sem_course_id = this.props.location.state.sem_course_id
  }

  componentDidMount() {
    this.fetchSemesterCourse();
    socket.addEventListener('semestersCourses/listener/changed', this.semestersCoursesListenerChanged)
  }

  componentWillUnmount() {
    socket.removeEventListener('semestersCourses/listener/changed', this.semestersCoursesListenerChanged)
  }


  semestersCoursesListenerChanged = (data) => {
    if (data.sem_course_id == this.sem_course_id)
      this.fetchSemesterCourse()
  }

  fetchSemesterCourse = () => {
    socket.emit("semestersCourses/fetch", {sem_course_id: this.sem_course_id}, (res) => {
      console.log(res)
      if (res.code == 200) {
        return this.setState({
          semesterCourse: res.data[0],
          loadingSemesterCourse: false,
        });
      }
    });
  }

  changeGradeDistribution = (key,value) => {
    this.setState({
      semesterCourse: {
        ...this.state.semesterCourse,
        grade_distribution: {
          ...this.state.semesterCourse.grade_distribution,
          [key]: key == 'mini_project' ? value : Number(value)
        }
      }
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
        {this.state.loadingSemesterCourse ? <LoadingIcon /> :
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
                    Grade Distribution
                  </Typography>
                </Grid>
                <Grid item xs={"auto"}>
                  <CustomTextField 
                    type='number'
                    required={true}
                    value={this.state.semesterCourse.grade_distribution.finals}
                    variant="filled"
                    label="Finals %"
                    onChange={(e) => this.changeGradeDistribution('finals',e.target.value)} 
                    onFocus={e => {
                      e.target.select();
                    }}/>
                </Grid>
                <Grid item xs={"auto"}>
                  <CustomTextField 
                    type='number'
                    required={true}
                    value={this.state.semesterCourse.grade_distribution.mids}
                    variant="filled"
                    label="Mids %"
                    onChange={(e) => this.changeGradeDistribution('mids',e.target.value)} 
                    onFocus={e => {
                      e.target.select();
                    }}/>
                </Grid>
                <Grid item xs={"auto"}>
                  <CustomTextField 
                    type='number'
                    required={true}
                    value={this.state.semesterCourse.grade_distribution.sessional}
                    variant="filled"
                    label="Sessional %"
                    onChange={(e) => this.changeGradeDistribution('sessional',e.target.value)} 
                    onFocus={e => {
                      e.target.select();
                    }}
                    />
                </Grid>
                <Grid item xs={"auto"}>
                  <CustomTextField 
                    type='number'
                    required={true}
                    value={this.state.semesterCourse.grade_distribution.attendance}
                    variant="filled"
                    label="Attendance %"
                    onChange={(e) => this.changeGradeDistribution('attendance',e.target.value)} 
                    onFocus={e => {
                      e.target.select();
                    }}
                    />
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={"auto"}>
                  <CustomTextField 
                    type='number'
                    required={true}
                    value={this.state.semesterCourse.grade_distribution.total_assignments}
                    variant="filled"
                    label="Total Assignments"
                    onChange={(e) => this.changeGradeDistribution('total_assignments',e.target.value)} 
                    onFocus={e => {
                      e.target.select();
                    }}
                    />
                </Grid>
                <Grid item xs={"auto"}>
                  <CustomTextField 
                    type='number'
                    required={true}
                    value={this.state.semesterCourse.grade_distribution.total_quizzes}
                    variant="filled"
                    label="Total Quizzes"
                    onChange={(e) => this.changeGradeDistribution('total_quizzes',e.target.value)} 
                    onFocus={e => {
                      e.target.select();
                    }}
                    />
                </Grid>
                <Grid item xs={"auto"}>
                  <FormControlLabel style={{userSelect: 'none'}} control={<Checkbox value={this.state.semesterCourse.grade_distribution.mini_project ? true : false} onChange={(e) => this.changeGradeDistribution('mini_project',e.target.checked)}/>} label="Mini Project" />
                </Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={"auto"}>
                  <CustomButton 
                    label="Save"
                    onClick={() => {
                      socket.emit(`semestersCourses/updateGradeDistribution`, {sem_course_id: this.sem_course_id, grade_distribution: this.state.semesterCourse.grade_distribution}, res => {
                        console.log(res)
                        this.setState({
                          alertMsg: res.code == 200 ? 'Updated grade distribution':`${res.status}: ${res.message}`,
                          alertSeverity: res.code == 200 ? 'success':'warning'
                        }, timeoutAlert)
                      })
                    }}
                  />
                </Grid>
                <Grid item xs={"auto"}>
                  <CustomButton 
                    label="Reset"
                    onClick={() => this.fetchSemesterCourse()}
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

export default withRouter(MisGradeDistribution);

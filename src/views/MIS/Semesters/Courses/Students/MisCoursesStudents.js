/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  Zoom,
  Alert
} from "@mui/material";
import { Delete, Edit } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { socket } from "../../../../../websocket/socket";
import { withRouter } from "../../../../../withRouter";
import CustomTable from "../../../../../components/CustomTable";
import CustomButton from "../../../../../components/CustomButton";
import CustomModal from "../../../../../components/CustomModal";
import ConfirmationModal from "../../../../../components/ConfirmationModal";
import GoBackButton from "../../../../../components/GoBackButton";
import CustomMultiAutocomplete from "../../../../../components/CustomMultiAutocomplete";
import LoadingIcon from "../../../../../components/LoadingIcon";
import CustomCard from "../../../../../components/CustomCard";

const palletes = {
  primary: "#439CEF",
  secondary: "#FFFFFF",
};

const styles = {
  container: {
    backgroundColor: palletes.primary,
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)",
    ],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
};

class MisCoursesStudents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingStudentsCourses: true,
      studentIds: [],

      alertMsg: '',
      alertSeverity: ''
    };
    this.sem_course_id = this.props.location.state.sem_course_id
    this.semester_name = this.props.location.state.semester_name
    this.course_name = this.props.location.state.course_name
    
    this.timeoutAlertRef = null
  }

  componentDidMount() {
    this.fetchStudentCourses();
    socket.addEventListener('studentsCourses/listener/changed', this.studentsCoursesListenerChanged)
  }

  componentWillUnmount() {
    socket.removeEventListener('studentsCourses/listener/changed', this.studentsCoursesListenerChanged)
  }

  studentsCoursesListenerChanged = (data) => {
    if (data.sem_course_id == this.sem_course_id)
      this.fetchStudentCourses()
  }
  
  fetchStudentCourses = () => {
    console.log('[fetchStudentCourses] called')
    socket.emit("studentsCourses/fetch", {sem_course_id: this.sem_course_id}, (res) => {
      console.log("studentsCourses/fetch res",res)
      if (res.code == 200) {
        return this.setState({
          loadingStudentsCourses: false,
          studentIds: res.data.map(studentCourse => studentCourse.student_id)
        });
      }
    });
  }

  updateStudentsList = () => {
    socket.emit("studentsCourses/assignStudents", {sem_course_id: this.sem_course_id, student_ids: this.state.studentIds}, (res) => {
      console.log(`[studentsCourses/assignStudents] response`,res)
      this.setState({
        alertMsg: res.code == 200 ? 'Students list updated' : `${res.status}: ${res.message}`,
        alertSeverity: res.code == 200 ? 'success':'warning'
      }, this.timeoutAlert)
    });
  }
  
  timeoutAlert = () => {
    console.log('timeoutAlert called')
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({alertMsg: ''}), 5000)
  }

  render() {
    return (
      <Grid container rowSpacing={"20px"}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs={12}>
        {
          this.state.loadingStudentsCourses ? <LoadingIcon />:
          <CustomCard cardContent={
            <React.Fragment>
              <Typography variant="h2" sx={{ margin: "10px" }}>
                {`${this.course_name} (${this.semester_name})`}
              </Typography>
              <Grid item xs={12} sx={{ margin: "10px" }}>
                <Zoom in={this.state.alertMsg == '' ? false:true} unmountOnExit mountOnEnter>
                  <Alert variant= "outlined" severity={this.state.alertSeverity}>{this.state.alertMsg}</Alert>
                </Zoom>
              </Grid>
              <Grid item xs={6} sx={{ margin: "10px" }}>
                <CustomMultiAutocomplete 
                  label="Students List" 
                  endpoint="autocomplete/batchStudents" 
                  endpointData={{}}
                  values={this.state.studentIds}
                  onChange={(e,values) => {
                    this.setState({studentIds: values.map(option => option.id)})
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomButton
                  sx={{ margin: "10px" }}
                  onClick={() => this.updateStudentsList()}
                  label="Save"
                />
                <CustomButton
                  sx={{ margin: "10px" }}
                  onClick={() => this.fetchStudentCourses()}
                  label="Reset"
                />
              </Grid>
            </React.Fragment>
          }/>
        }
        </Grid>
        </Grid>
    );
  }
}

export default withRouter(MisCoursesStudents);

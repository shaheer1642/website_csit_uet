/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  ButtonGroup
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

class MisTeachersCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingSemesterCourses: true,
      semestersCoursesArr: [],

      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => {}
    };
  }

  componentDidMount() {
    this.fetchSemesterCourses();
    socket.addEventListener('semestersCourses/listener/changed', this.semestersCoursesListenerChanged)
  }

  componentWillUnmount() {
    socket.removeEventListener('semestersCourses/listener/changed', this.semestersCoursesListenerChanged)
  }


  semestersCoursesListenerChanged = (data) => {
    this.fetchSemesterCourses()
  }
  
  fetchSemesterCourses = () => {
    socket.emit("semestersCourses/fetch", {teacher_id: user.user_id}, (res) => {
      if (res.code == 200) {
        return this.setState({
          semestersCoursesArr: res.data,
          loadingSemesterCourses: false,
        });
      }
    });
  }
  
  confirmationModalDestroy = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalMessage: '',
      confirmationModalExecute: () => {}
    })
  }

  render() {
    const columns = [
      { id: "course_id", label: "Course ID", format: (value) => value },
      { id: "course_name", label: "Course Name", format: (value) => value },
      { id: "semester_season", label: "Semester Season", format: (value) => value },
      { id: "semester_year", label: "Semester Year", format: (value) => value },
      { id: "department", label: "Department", format: (value) => value },
      { id: "teacher_name", label: "Teacher Name", format: (value) => value },
      { id: "registered_students", label: "Total Students", format: (value) => value },
    ];
    return (
      <CustomCard cardContent={
      <Grid container >
        <Typography variant="h2" style={{ margin: "10px" }}>
          Select Course
        </Typography>
        <CustomTable
          loadingState = {this.state.loadingSemesterCourses}
          onRowClick={(semesterCourse) => 
            this.props.navigate('grading', {
              state: {
                sem_course_id: semesterCourse.sem_course_id,
                course_name: `${semesterCourse.course_id} ${semesterCourse.course_name} | ${semesterCourse.semester_season} ${semesterCourse.semester_year}`
              }
            })
          }
          rows={this.state.semestersCoursesArr}
          columns={columns}
        />
        </Grid>
      }/>
    );
  }
}

export default withRouter(MisTeachersCourses);

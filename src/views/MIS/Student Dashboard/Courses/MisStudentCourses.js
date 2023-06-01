/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import { Navigate } from 'react-router-dom'
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
import { getUserNameById } from "../../../../objects/Users_List";

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

class MisStudentCourses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      studentCoursesArr: [],
    };
    this.student_batch_id = this.props.location?.state?.student_batch_id
    this.semester_id = this.props.location?.state?.semester_id
  }
  componentDidMount() {
    this.fetchStudentCourses();
  }

  componentWillUnmount() {
  }

  fetchStudentCourses = () => {
    socket.emit("studentsCourses/fetch", {student_batch_id: this.student_batch_id, semester_id: this.semester_id}, (res) => {
      if (res.code == 200) {
        return this.setState({
          studentCoursesArr: res.data,
          loading: false,
        });
      }
    });
  }

  render() {
    const columns = [
      { id: "course_id", label: "Course ID", format: (value) => value },
      { id: "course_name", label: "Course Name", format: (value) => value },
      { id: "course_type", label: "Course Type", format: (value) => value },
      { id: "semester_season", label: "Semester Season", format: (value) => value },
      { id: "semester_year", label: "Semester Year", format: (value) => value },
      { id: "department", label: "Department", format: (value) => value },
      { id: "teacher_id", label: "Teacher Name", format: (value) => getUserNameById(value) },
    ];
    if (!this.student_batch_id) return <Navigate to='/mis/sportal/batches' state={{...this.props.location?.state, redirect: '/mis/sportal/courses'}} />
    else if (!this.semester_id) return <Navigate to='/mis/sportal/semesters' state={{...this.props.location?.state, redirect: '/mis/sportal/courses'}} />
    return (
      <Grid container rowSpacing={"20px"}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs = {12}>
          <CustomCard cardContent={
          <Grid container >
            <Typography variant="h2" style={{ margin: "10px" }}>
              Select Course
            </Typography>
            <CustomTable
              loadingState = {this.state.loading}
              onRowClick={(semesterCourse) => 
                this.props.navigate('grading', {
                  state: {
                    semester_id: this.semester_id,
                    student_batch_id: this.student_batch_id,
                    sem_course_id: semesterCourse.sem_course_id,
                    course_name: `${semesterCourse.course_id} ${semesterCourse.course_name} | ${semesterCourse.semester_season} ${semesterCourse.semester_year}`
                  }
                })
              }
              rows={this.state.studentCoursesArr}
              columns={columns}
            />
            </Grid>
          }/>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisStudentCourses);

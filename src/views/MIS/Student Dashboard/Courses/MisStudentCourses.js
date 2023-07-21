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
import CustomCard from "../../../../components/CustomCard";
import { getUserNameById } from "../../../../objects/Users_List";
import { convertUpper } from "../../../../extras/functions";

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
    this.student_batch = this.props.location?.state?.student_batch
    this.student_semester = this.props.location?.state?.student_semester
  }
  componentDidMount() {
    this.fetchStudentCourses();
  }

  componentWillUnmount() {
  }

  fetchStudentCourses = () => {
    if (!this.student_semester || !this.student_batch) return
    socket.emit("studentsCourses/fetch", { student_batch_id: this.student_batch?.student_batch_id, semester_id: this.student_semester?.semester_id }, (res) => {
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
      { id: "course_type", label: "Course Type", format: (value) => convertUpper(value) },
      { id: "semester_season", label: "Semester Season", format: (value) => convertUpper(value) },
      { id: "semester_year", label: "Semester Year", format: (value) => value },
      { id: "department_name", label: "Department", format: (value) => value },
      { id: "teacher_name", label: "Instructor", format: (value) => value },
    ];
    if (!this.student_batch) return <Navigate to='/mis/sportal/batches' state={{ ...this.props.location?.state, redirect: '/mis/sportal/courses', student_id: this.props.user?.user_id }} />
    else if (!this.student_semester) return <Navigate to='/mis/sportal/semesters' state={{ ...this.props.location?.state, redirect: '/mis/sportal/courses', student_batch_id: this.student_batch?.student_batch_id }} />
    return (
      <Grid container spacing={2}>
        <GoBackButton context={this.props.navigate} />
        <Grid item xs={12}>
          <CustomCard>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h2">
                  Select Course
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTable
                  loadingState={this.state.loading}
                  onRowClick={(semesterCourse) =>
                    this.props.navigate('/mis/tportal/courses/grading', {
                      state: {
                        semester_id: this.student_batch.semester_id,
                        student_batch_id: this.student_batch.student_batch_id,
                        sem_course_id: semesterCourse.sem_course_id,
                        context_info: { ...semesterCourse, ...this.student_semester }
                      }
                    })
                  }
                  rowSx={(semesterCourse) => {
                    return semesterCourse.grade == 'W' ? {
                      backgroundColor: Color.red[100]
                    } : semesterCourse.is_repeat ? {
                      backgroundColor: Color.yellow[100]
                    } : undefined
                  }}
                  footerText="Red = Course Withdrawn\nYellow = Repeater"
                  rows={this.state.studentCoursesArr}
                  columns={columns}
                />
              </Grid>
            </Grid>
          </CustomCard>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisStudentCourses);

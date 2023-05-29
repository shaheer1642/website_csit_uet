/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid,
  Typography,
} from "@mui/material";
import { withRouter } from "../../../../withRouter";
import GoBackButton from "../../../../components/GoBackButton";
import MisStudentCourseGradeMarking from "./MisStudentCourseGradeMarking";
import MisStudentCourseAttendance from "./MisStudentCourseAttendance";

class MisStudentCourseGradeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingForm: ''
    };
    this.course_name = this.props.location.state.course_name
    this.sem_course_id = this.props.location.state.sem_course_id
    this.semester_id = this.props.location.state.semester_id
    this.student_batch_id = this.props.location.state.student_batch_id
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Grid container rowSpacing={"20px"} maxWidth={'90vw'}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs={12}>
          <Typography variant="h2">
            {this.course_name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <MisStudentCourseGradeMarking />
        </Grid>
        <Grid item xs={12}>
          <MisStudentCourseAttendance />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(MisStudentCourseGradeManagement);

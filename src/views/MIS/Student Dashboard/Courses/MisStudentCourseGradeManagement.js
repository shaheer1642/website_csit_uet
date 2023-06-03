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
import ContextInfo from "../../../../components/ContextInfo";

class MisStudentCourseGradeManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingForm: ''
    };
    this.sem_course_id = this.props.location.state.sem_course_id
    this.semester_id = this.props.location.state.semester_id
    this.student_batch_id = this.props.location.state.student_batch_id
    this.context_info = this.props.location.state.context_info
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
          <ContextInfo contextInfo={this.context_info} />
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

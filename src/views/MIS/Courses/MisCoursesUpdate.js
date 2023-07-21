/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';
import GoBackButton from "../../../components/GoBackButton";
import { Grid } from "@mui/material";

class MisCoursesUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      // cnic: '',
      // reg_no: '',
      course: {},
      // course_gender: 'Male'
    }
    this.course_id = this.props.location.state.course_id
  }

  componentDidMount() {
    socket.emit('courses/fetch', { course_id: this.course_id }, (res) => {
      console.log('[courses/fetch] response:', res)
      if (res.code == 200) {
        const course = res.data[0]
        this.setState({
          loading: false,
          course: course,
        })
      }
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon /> :
        <Grid container spacing={2}>
          <GoBackButton context={this.props.navigate} />
          <Grid item xs={12}>
            <FormGenerator
              endpoint="courses"
              formType="update"
              submitSuccessMessage='Course Edited Successfully'
              backgroundColor='white'
              options={{
                course_id: {
                  label: "Course ID",
                  defaultValue: this.state.course.course_id,
                  disabled: true,
                  position: 1,
                  xs: 6,
                },
                course_name: {
                  label: "Course Title",
                  defaultValue: this.state.course.course_name,
                  position: 2,
                  xs: 6,
                },
                course_description: {
                  label: 'Course Description',
                  defaultValue: this.state.course.course_description,
                  position: 3,
                  xs: 12,
                },
                course_type: {
                  label: 'Course Type',
                  defaultValue: this.state.course.course_type,
                  position: 4,
                  xs: 6,
                  fieldType: 'radiobox',
                  fieldTypeOptions: ['core', 'elective']
                },
                credit_hours: {
                  label: "Credit Hours",
                  defaultValue: this.state.course.credit_hours,
                  position: 5,
                  xs: 12,
                  width: '150px'
                },
                department: {
                  label: "Department",
                  defaultValue: this.state.course.department,
                  position: 6,
                  xs: 6,
                },
              }}
            />
          </Grid>
        </Grid>
    );
  }
}

export default withRouter(MisCoursesUpdate);
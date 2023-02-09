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
      course_name: '',
      // course_gender: 'Male'
    }
    this.course_id = this.props.location.state.course_id
  }

  componentDidMount() {
    socket.emit('courses/fetch', {course_id: this.course_id}, (res) => {
      console.log('[courses/fetch] response:',res)
      if (res.code == 200) {
        const course = res.data[0]
        this.setState({
          loading: false,
          course_name: course.course_name,
          departmental: course.departmental,
        })
      }
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon />:
      <Grid container>
        <GoBackButton context={this.props.navigate}/>
        <FormGenerator 
          endpoint="courses"
          formType="update" 
          submitSuccessMessage='Course Edited Successfully'
          backgroundColor='white'
          options={{
            course_id: {
              label: "Course ID",
              defaultValue: this.course_id,
              disabled: true,
              position: 1,
              xs: 6,
            },
            course_name: {
              label: "Course Name",
              defaultValue: this.state.course_name,
              position: 2,
              xs: 6,
            },
            departmental: {
              label: "Departmental",
              defaultValue: this.state.departmental,
              position: 3,
              xs: 6,
            },
          }}
        />
      </Grid>
    );
  }
}

export default withRouter(MisCoursesUpdate);
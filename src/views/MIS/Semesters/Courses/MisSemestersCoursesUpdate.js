/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../../components/FormGenerator';
import { socket } from '../../../../websocket/socket';
import { withRouter } from '../../../../withRouter';
import LoadingIcon from '../../../../components/LoadingIcon';
import GoBackButton from '../../../../components/GoBackButton';
import { Grid } from '@mui/material';
import ContextInfo from '../../../../components/ContextInfo';

class MisSemestersCoursesUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      semester_id: '',
      course_id: '',
      teacher_id: '',
    }
    this.sem_course_id = this.props.location.state.sem_course_id
    this.context_info = this.props.location.state.context_info
  }

  componentDidMount() {
    socket.emit('semestersCourses/fetch', { sem_course_id: this.sem_course_id }, (res) => {
      console.log('[semestersCourses/fetch] response:', res)
      if (res.code == 200) {
        const semestersCourses = res.data[0]
        console.log('setting state')
        this.setState({
          loading: false,
          semester_id: semestersCourses.semester_id,
          course_id: semestersCourses.course_id,
          teacher_id: semestersCourses.teacher_id,
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
            <ContextInfo contextInfo={this.context_info} omitIncludeKeys={['teacher_name']} />
          </Grid>
          <Grid item xs={12}>
            <FormGenerator
              endpoint="semestersCourses"
              formType="updateTeacher"
              submitSuccessMessage='Course Edited Successfully'
              backgroundColor='white'
              options={{
                sem_course_id: {
                  label: "Semester Course ID",
                  defaultValue: this.sem_course_id,
                  disabled: true,
                  position: 1,
                  xs: 6,
                  hidden: true
                },
                semester_id: {
                  label: "Semester ID",
                  defaultValue: this.state.semester_id,
                  disabled: true,
                  position: 1,
                  xs: 6,
                  hidden: true
                },
                course_id: {
                  label: "Course ID",
                  defaultValue: this.state.course_id,
                  disabled: true,
                  position: 2,
                  xs: 6,
                },
                teacher_id: {
                  label: "Teacher",
                  defaultValue: this.state.teacher_id,
                  position: 1,
                  xs: 6,
                  fieldType: 'select',
                  endpoint: 'autocomplete/teachers'
                },
              }}
            />
          </Grid>
        </Grid>
    );
  }
}

export default withRouter(MisSemestersCoursesUpdate);
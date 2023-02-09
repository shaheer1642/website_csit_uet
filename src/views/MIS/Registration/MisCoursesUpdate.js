/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';

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
          // cnic: course.cnic,
          // reg_no: course.reg_no,
          course_name: course.course_name,
          // course_gender: course.course_gender,
        })
      }
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon />:
      <FormGenerator 
        endpoint="courses"
        formType="update" 
        submitSuccessMessage='course Edited Successfully'
        backgroundColor='white'
        options={{
          course_id: {
            label: "course ID",
            defaultValue: this.course_id,
            disabled: true,
            position: 1,
            xs: 6,
          },
         
          // cnic: {
          //   label: "CNIC",
          //   defaultValue: this.state.cnic,
          //   position: 3,
          //   xs: 6,
          // },
          // reg_no: {
          //   label: "Registration No",
          //   defaultValue: this.state.reg_no,
          //   position: 4,
          //   xs: 6,
          // },
          course_name: {
            label: "course Name",
            defaultValue: this.state.course_name,
            position: 5,
            xs: 6,
          },
     
          // course_gender: {
          //   label: "Gender",
          //   defaultValue: this.state.course_gender,
          //   position: 7,
          //   xs: 6,
          //   fieldType: 'radiobox',
          //   fieldTypeOptions: ['Male', 'Female']
          // },
        }}
      />
    );
  }
}

export default withRouter(MisCoursesUpdate);
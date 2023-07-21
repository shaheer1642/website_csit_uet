/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';
import { Grid } from '@mui/material';
import GoBackButton from '../../../components/GoBackButton';

class MisTeachersUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      cnic: '',
      reg_no: '',
      teacher_name: '',
      teacher_gender: 'Male',
      user_email: '',
      qualification: '',
      designation: '',
      teacher_department_id: ''
    }
    this.teacher_id = this.props.location.state.teacher_id
  }

  componentDidMount() {
    socket.emit('teachers/fetch', { teacher_id: this.teacher_id }, (res) => {
      console.log('[teachers/fetch] response:', res)
      if (res.code == 200) {
        const teacher = res.data[0]
        this.setState({
          loading: false,
          cnic: teacher.cnic,
          reg_no: teacher.reg_no,
          teacher_name: teacher.teacher_name,
          teacher_gender: teacher.teacher_gender,
          user_email: teacher.user_email,
          qualification: teacher.qualification,
          designation: teacher.designation,
          teacher_department_id: teacher.teacher_department_id,
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
              endpoint="teachers"
              formType="update"
              submitSuccessMessage='Instructor Edited Successfully'
              backgroundColor='white'
              options={{
                teacher_id: {
                  label: "Teacher ID",
                  defaultValue: this.teacher_id,
                  disabled: true,
                  position: 1,
                  xs: 6,
                  hidden: true
                },
                cnic: {
                  label: "CNIC",
                  defaultValue: this.state.cnic,
                  position: 2,
                  xs: 6,
                },
                reg_no: {
                  label: "Registration No",
                  defaultValue: this.state.reg_no,
                  position: 3,
                  xs: 6,
                },
                teacher_name: {
                  label: "Instructor Name",
                  defaultValue: this.state.teacher_name,
                  position: 4,
                  xs: 6,
                },
                teacher_gender: {
                  label: "Gender",
                  defaultValue: this.state.teacher_gender,
                  position: 5,
                  xs: 6,
                  fieldType: 'radiobox',
                  fieldTypeOptions: ['male', 'female']
                },
                qualification: {
                  label: "Qualification",
                  defaultValue: this.state.qualification,
                  position: 6,
                  xs: 6,
                },
                designation: {
                  label: "Designation",
                  defaultValue: this.state.designation,
                  position: 7,
                  xs: 6,
                  fieldType: 'radiobox',
                  fieldTypeOptions: ['Dean', 'Assistant to Dean', 'Assistant Professor', 'Lecturer']
                },
                user_email: {
                  label: "Email",
                  defaultValue: this.state.user_email,
                  position: 8,
                  xs: 6,
                },
                digital_signature: {
                  hidden: true
                },
                areas_of_interest: {
                  hidden: true
                },
                teacher_department_id: {
                  label: "Department",
                  position: 9,
                  xs: 6,
                  defaultValue: this.state.teacher_department_id,
                  fieldType: 'select',
                  endpoint: 'autocomplete/departments',
                },
              }}
            />
          </Grid>
        </Grid>

    );
  }
}

export default withRouter(MisTeachersUpdate);
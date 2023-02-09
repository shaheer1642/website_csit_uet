/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../../../components/FormGenerator';
import { socket } from '../../../../../websocket/socket';
import { withRouter } from '../../../../../withRouter';
import LoadingIcon from '../../../../../components/LoadingIcon';
import { Grid } from '@mui/material'
import GoBackButton from '../../../../../components/GoBackButton';

class MisStudentsUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      cnic: '',
      reg_no: '',
      student_name: '',
      student_father_name: '',
      student_address: '',
      student_gender: 'Male'
    }
    this.student_id = this.props.location.state.student_id
    this.batch_id = this.props.location.state.batch_id
  }

  componentDidMount() {
    socket.emit('students/fetch', {student_id: this.student_id, batch_id: this.batch_id}, (res) => {
      console.log('[students/fetch] response:',res)
      if (res.code == 200) {
        const student = res.data[0]
        this.setState({
          loading: false,
          cnic: student.cnic,
          reg_no: student.reg_no,
          student_name: student.student_name,
          student_father_name: student.student_father_name,
          student_address: student.student_address,
          student_gender: student.student_gender,
        })
      }
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon />:
      <Grid>
<GoBackButton context={this.props.navigate}/>
      <FormGenerator 
        endpoint="students"
        formType="update" 
        submitSuccessMessage='Student Edited Successfully'
        backgroundColor='white'
        options={{
          student_id: {
            label: "Student ID",
            defaultValue: this.student_id,
            disabled: true,
            position: 1,
            xs: 6,
          },
          batch_id: {
            label: "Batch ID",
            defaultValue: this.batch_id,
            disabled: true,
            position: 2,
            xs: 6,
          },
          cnic: {
            label: "CNIC",
            defaultValue: this.state.cnic,
            position: 3,
            xs: 6,
          },
          reg_no: {
            label: "Registration No",
            defaultValue: this.state.reg_no,
            position: 4,
            xs: 6,
          },
          student_name: {
            label: "Student Name",
            defaultValue: this.state.student_name,
            position: 5,
            xs: 6,
          },
          student_father_name: {
            label: "Father Name",
            defaultValue: this.state.student_father_name,
            position: 6,
            xs: 6,
          },
          student_address: {
            label: "Address",
            defaultValue: this.state.student_address,
            position: 7,
            xs: 6,
          },
          student_gender: {
            label: "Gender",
            defaultValue: this.state.student_gender,
            position: 7,
            xs: 6,
            fieldType: 'radiobox',
            fieldTypeOptions: ['Male', 'Female']
          },
        }}
      />
      </Grid>
      
    );
  }
}

export default withRouter(MisStudentsUpdate);
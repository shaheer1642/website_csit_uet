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
      teacher_gender: 'Male'
    }
    this.teacher_id = this.props.location.state.teacher_id
  }

  componentDidMount() {
    socket.emit('teachers/fetch', {teacher_id: this.teacher_id}, (res) => {
      console.log('[teachers/fetch] response:',res)
      if (res.code == 200) {
        const teacher = res.data[0]
        this.setState({
          loading: false,
          cnic: teacher.cnic,
          reg_no: teacher.reg_no,
          teacher_name: teacher.teacher_name,
          teacher_gender: teacher.teacher_gender,
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
        endpoint="teachers"
        formType="update" 
        submitSuccessMessage='Teacher Edited Successfully'
        backgroundColor='white'
        options={{
          teacher_id: {
            label: "Teacher ID",
            defaultValue: this.teacher_id,
            disabled: true,
            position: 1,
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
          teacher_name: {
            label: "Teacher Name",
            defaultValue: this.state.teacher_name,
            position: 5,
            xs: 6,
          },
     
          teacher_gender: {
            label: "Gender",
            defaultValue: this.state.teacher_gender,
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

export default withRouter(MisTeachersUpdate);
/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../../../components/FormGenerator';
import { socket } from '../../../../../websocket/socket';
import { withRouter } from '../../../../../withRouter';
import LoadingIcon from '../../../../../components/LoadingIcon';
import { CircularProgress, Grid } from '@mui/material'
import GoBackButton from '../../../../../components/GoBackButton';
import CustomButton from '../../../../../components/CustomButton';
import ConfirmationModal from '../../../../../components/ConfirmationModal';

class MisStudentsUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      callingApi: false,
      cnic: '',
      reg_no: '',
      student_name: '',
      student_father_name: '',
      student_address: '',
      student_gender: 'Male',
      user_email: '',
      student: undefined,

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => {},
    }
    this.student_id = this.props.location.state.student_id
    this.batch_id = this.props.location.state.batch_id
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.setState({loading: true})
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
          user_email: student.user_email,
          student: student
        })
      }
    })
  }

  semesterFreeze = () => {
    this.setState({callingApi: true})
    socket.emit('students/freezeSemester',{student_batch_id: this.state.student.student_batch_id, semester_frozen: !this.state.student.semester_frozen}, (res) => {
      this.setState({callingApi: false})
      this.fetchData()
    })
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon />:
      <Grid container rowSpacing={"20px"}>
        <GoBackButton context={this.props.navigate}/>
        <Grid item xs={12}>
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
              user_email: {
                label: "Email",
                defaultValue: this.state.user_email,
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
                fieldTypeOptions: ['male', 'female']
              },
            }}
          >
            <Grid item xs={'auto'}>
              <CustomButton 
                color={this.state.student.semester_frozen ? 'success' : 'error'} 
                label={this.state.callingApi ? <CircularProgress size='20px' /> : this.state.student.semester_frozen ? 'Unfreeze Semester' : 'Freeze Semester'} 
                variant='outlined'
                onClick={() => this.setState({
                  confirmationModalShow: true,
                  confirmationModalMessage: `Are you sure you want to ${ this.state.student.semester_frozen ? 'unfreeze' : 'freeze'} semester for this student?`,
                  confirmationModalExecute: () => this.semesterFreeze()
                })}
                disabled={this.state.callingApi}
              />
            </Grid>
          </FormGenerator>
        </Grid>
        <ConfirmationModal
          open={this.state.confirmationModalShow}
          message={this.state.confirmationModalMessage}
          onClose={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => {}, })}
          onClickNo={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => {}, })}
          onClickYes={() => {
            this.state.confirmationModalExecute();
            this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => {}, })
          }}
        />
      </Grid>
    );
  }
}

export default withRouter(MisStudentsUpdate);
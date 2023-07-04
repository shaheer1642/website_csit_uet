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
      callingApi: '',
      cnic: '',
      reg_no: '',
      student_name: '',
      student_father_name: '',
      student_address: '',
      student_gender: 'Male',
      student_admission_status: '',
      student_contact_no: '',
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
          student_admission_status: student.student_admission_status,
          student_contact_no: student.student_contact_no,
          user_email: student.user_email,
          student: student
        })
      }
    })
  }

  degreeComplete = () => {
    this.setState({callingApi: 'degreeComplete'})
    socket.emit('students/completeDegree',{
      student_batch_id: this.state.student.student_batch_id, 
      degree_completed: !this.state.student.degree_completed
    }, (res) => {
      this.setState({callingApi: ''})
      this.fetchData()
    })
  }

  semesterFreeze = () => {
    this.setState({callingApi: 'semesterFreeze'})
    socket.emit('students/freezeSemester',{
      student_batch_id: this.state.student.student_batch_id, 
      semester_frozen: !this.state.student.semester_frozen
    }, (res) => {
      this.setState({callingApi: ''})
      this.fetchData()
    })
  }

  cancelAdmission = () => {
    this.setState({callingApi: 'cancelAdmission'})
    socket.emit('students/cancelAdmission',{
      student_batch_id: this.state.student.student_batch_id, 
      admission_cancelled: !this.state.student.admission_cancelled
    }, (res) => {
      this.setState({callingApi: ''})
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
                hidden: true
              },
              batch_id: {
                label: "Batch ID",
                defaultValue: this.batch_id,
                disabled: true,
                position: 2,
                xs: 6,
                hidden: true
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
              student_gender: {
                label: "Gender",
                defaultValue: this.state.student_gender,
                position: 7,
                xs: 6,
                fieldType: 'radiobox',
                fieldTypeOptions: ['male', 'female']
              },
              student_admission_status: {
                label: "Admission Status",
                defaultValue: this.state.student_admission_status,
                position: 8,
                xs: 6,
                fieldType: 'radiobox',
                fieldTypeOptions: ['open_merit', 'rationalized','afghan_student']
              },
              user_email: {
                label: "Email",
                defaultValue: this.state.user_email,
                position: 9,
                xs: 6,
              },
              student_contact_no: {
                label: "Contact #",
                defaultValue: this.state.student_contact_no,
                position: 10,
                xs: 6,
              },
              student_address: {
                label: "Address",
                defaultValue: this.state.student_address,
                position: 11,
                xs: 6,
              },
            }}
            >
            <Grid item xs={'auto'}>
              <CustomButton 
                disabled={this.state.student.semester_frozen || this.state.student.admission_cancelled}
                color={this.state.student.degree_completed ? 'error' : 'success'} 
                callingApiState={this.state.callingApi == 'degreeComplete'}
                label={this.state.student.degree_completed ? 'Mark Degree Incomplete' : 'Mark Degree Completed'} 
                variant='outlined'
                onClick={() => this.setState({
                  confirmationModalShow: true,
                  confirmationModalMessage: `Are you sure you want to mark degree as ${ this.state.student.degree_completed ? 'incomplete' : 'completed'} for this student?`,
                  confirmationModalExecute: () => this.degreeComplete()
                })}
              />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton 
                disabled={this.state.student.degree_completed || this.state.student.admission_cancelled}
                color={this.state.student.semester_frozen ? 'success' : 'error'} 
                callingApiState={this.state.callingApi == 'semesterFreeze'}
                label={this.state.student.semester_frozen ? 'Unfreeze Semester' : 'Freeze Semester'} 
                variant='outlined'
                onClick={() => this.setState({
                  confirmationModalShow: true,
                  confirmationModalMessage: `Are you sure you want to ${ this.state.student.semester_frozen ? 'unfreeze' : 'freeze'} semester for this student?`,
                  confirmationModalExecute: () => this.semesterFreeze()
                })}
              />
            </Grid>
            <Grid item xs={'auto'}>
              <CustomButton 
                disabled={this.state.student.degree_completed}
                color={this.state.student.admission_cancelled ? 'success' : 'error'} 
                callingApiState={this.state.callingApi == 'cancelAdmission'}
                label={this.state.student.admission_cancelled ? 'Uncancel Admission' : 'Cancel Admission'} 
                variant='outlined'
                onClick={() => this.setState({
                  confirmationModalShow: true,
                  confirmationModalMessage: `Are you sure you want to ${ this.state.student.admission_cancelled ? 'uncancel' : 'cancel'} admission for this student?`,
                  confirmationModalExecute: () => this.cancelAdmission()
                })}
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
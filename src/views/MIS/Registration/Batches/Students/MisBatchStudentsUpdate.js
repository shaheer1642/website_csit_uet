/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../../../components/FormGenerator';
import { socket } from '../../../../../websocket/socket';
import { withRouter } from '../../../../../withRouter';
import LoadingIcon from '../../../../../components/LoadingIcon';
import { CircularProgress, Grid, Typography } from '@mui/material'
import GoBackButton from '../../../../../components/GoBackButton';
import CustomButton from '../../../../../components/CustomButton';
import ConfirmationModal from '../../../../../components/ConfirmationModal';
import CustomCard from '../../../../../components/CustomCard';
import Field from '../../../../../components/Field';
import CustomTextField from '../../../../../components/CustomTextField';

class MisStudentsUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: 'fetchData',
      student: undefined,

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    }
    this.student_id = this.props.location.state.student_id
    this.batch_id = this.props.location.state.batch_id
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.setState({ callingApi: 'fetchData' })
    socket.emit('students/fetch', { student_id: this.student_id, batch_id: this.batch_id }, (res) => {
      if (res.code == 200) {
        this.setState({
          callingApi: '',
          student: res.data[0]
        })
      }
    })
  }

  render() {
    return (
      this.state.callingApi == 'fetchData' ? <LoadingIcon /> :
        <Grid container spacing={2}>
          <GoBackButton context={this.props.navigate} />
          <Grid item xs={12}>
            <FormGenerator
              endpoint="students"
              formType="update"
              submitSuccessMessage='Student Edited Successfully'
              backgroundColor='white'
              options={{
                student_id: {
                  label: "Student ID",
                  defaultValue: this.state.student.student_id,
                  disabled: true,
                  position: 1,
                  xs: 6,
                  hidden: true
                },
                batch_id: {
                  label: "Batch ID",
                  defaultValue: this.state.student.batch_id,
                  disabled: true,
                  position: 2,
                  xs: 6,
                  hidden: true
                },
                cnic: {
                  label: "CNIC",
                  defaultValue: this.state.student.cnic,
                  position: 3,
                  xs: 6,
                },
                reg_no: {
                  label: "Registration No",
                  defaultValue: this.state.student.reg_no,
                  position: 4,
                  xs: 6,
                },
                student_name: {
                  label: "Student Name",
                  defaultValue: this.state.student.student_name,
                  position: 5,
                  xs: 6,
                },
                student_father_name: {
                  label: "Father Name",
                  defaultValue: this.state.student.student_father_name,
                  position: 6,
                  xs: 6,
                },
                student_gender: {
                  label: "Gender",
                  defaultValue: this.state.student.student_gender,
                  position: 7,
                  xs: 6,
                  fieldType: 'radiobox',
                  fieldTypeOptions: ['male', 'female']
                },
                student_admission_status: {
                  label: "Admission Status",
                  defaultValue: this.state.student.student_admission_status,
                  position: 8,
                  xs: 6,
                  fieldType: 'radiobox',
                  fieldTypeOptions: ['open_merit', 'rationalized', 'afghan_student']
                },
                user_email: {
                  label: "Email",
                  defaultValue: this.state.student.user_email,
                  position: 9,
                  xs: 6,
                },
                student_contact_no: {
                  label: "Contact #",
                  defaultValue: this.state.student.student_contact_no,
                  position: 10,
                  xs: 6,
                },
                student_address: {
                  label: "Address",
                  defaultValue: this.state.student.student_address,
                  position: 11,
                  xs: 6,
                },
              }}
            >
            </FormGenerator>
          </Grid>
          <ConfirmationModal
            open={this.state.confirmationModalShow}
            message={this.state.confirmationModalMessage}
            onClose={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => { }, })}
            onClickNo={() => this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => { }, })}
            onClickYes={() => {
              this.state.confirmationModalExecute();
              this.setState({ confirmationModalShow: false, confirmationModalMessage: "", confirmationModalExecute: () => { }, })
            }}
          />
        </Grid>
    );
  }
}

export default withRouter(MisStudentsUpdate);
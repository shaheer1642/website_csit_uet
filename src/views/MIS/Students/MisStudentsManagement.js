/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';
import { CircularProgress, Grid, Typography } from '@mui/material'
import GoBackButton from '../../../components/GoBackButton';
import CustomButton from '../../../components/CustomButton';
import ConfirmationModal from '../../../components/ConfirmationModal';
import CustomCard from '../../../components/CustomCard';
import Field from '../../../components/Field';
import CustomTextField from '../../../components/CustomTextField';
import FormGenerator from '../../../components/FormGenerator';
import CustomTable from '../../../components/CustomTable';
import { convertUpper } from '../../../extras/functions';

class MisStudentsManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: 'fetchStudent',

      student: undefined,
      studentCoursesArr: undefined,

      degree_extension_period: 0,
      degree_extension_reason: '',

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    }
    this.student_batch_id = this.props.location.state.student_batch_id
  }

  componentDidMount() {
    this.fetchStudent()
    this.fetchStudentCourses()
  }

  fetchStudent = () => {
    this.setState({ callingApi: 'fetchStudent' })
    socket.emit('students/fetch', { student_batch_id: this.student_batch_id }, (res) => {
      console.log('[students/fetch] response:', res)
      if (res.code == 200) {
        this.setState({
          callingApi: '',
          student: res.data[0]
        })
      }
    })
  }

  fetchStudentCourses = () => {
    socket.emit('studentsCourses/fetch', { student_batch_id: this.student_batch_id }, (res) => {
      if (res.code == 200) {
        this.setState({
          callingApi: '',
          studentCoursesArr: res.data
        })
      }
    })
  }

  extendDegreeTime = () => {
    this.setState({ callingApi: 'extendDegreeTime' })
    socket.emit('students/extendDegreeTime', {
      student_batch_id: this.state.student.student_batch_id,
      degree_extension_period: { period: Number(this.state.degree_extension_period) * 86400000, reason: this.state.degree_extension_reason },
    }, (res) => {
      this.setState({ callingApi: '' })
      this.fetchStudent()
    })
  }

  degreeComplete = () => {
    this.setState({ callingApi: 'degreeComplete' })
    socket.emit('students/completeDegree', {
      student_batch_id: this.state.student.student_batch_id,
      degree_completed: !this.state.student.degree_completed
    }, (res) => {
      this.setState({ callingApi: '' })
      this.fetchStudent()
    })
  }

  semesterFreeze = () => {
    this.setState({ callingApi: 'semesterFreeze' })
    socket.emit('students/freezeSemester', {
      student_batch_id: this.state.student.student_batch_id,
      semester_frozen: !this.state.student.semester_frozen
    }, (res) => {
      this.setState({ callingApi: '' })
      this.fetchStudent()
    })
  }

  cancelAdmission = () => {
    this.setState({ callingApi: 'cancelAdmission' })
    socket.emit('students/cancelAdmission', {
      student_batch_id: this.state.student.student_batch_id,
      admission_cancelled: !this.state.student.admission_cancelled
    }, (res) => {
      this.setState({ callingApi: '' })
      this.fetchStudent()
    })
  }

  cards = {
    Info: () => {
      return (
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
          <Grid item xs={'auto'}>
            <CustomButton
              disabled={this.state.student.semester_frozen || this.state.student.admission_cancelled}
              color={this.state.student.degree_completed ? 'error' : 'success'}
              callingApiState={this.state.callingApi == 'degreeComplete'}
              label={this.state.student.degree_completed ? 'Mark Degree Incomplete' : 'Mark Degree Completed'}
              variant='outlined'
              onClick={() => this.setState({
                confirmationModalShow: true,
                confirmationModalMessage: `Are you sure you want to mark degree as ${this.state.student.degree_completed ? 'incomplete' : 'completed'} for this student?`,
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
                confirmationModalMessage: `Are you sure you want to ${this.state.student.semester_frozen ? 'unfreeze' : 'freeze'} semester for this student?`,
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
                confirmationModalMessage: `Are you sure you want to ${this.state.student.admission_cancelled ? 'uncancel' : 'cancel'} admission for this student?`,
                confirmationModalExecute: () => this.cancelAdmission()
              })}
            />
          </Grid>
        </FormGenerator>
      )
    },
    DegreeExtension: () => {
      return (
        <CustomCard>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h2">
                Degree Extension
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Field name='Total Extensions' value={this.state.student.degree_extension_periods.length} />
              <Field name='History' alignment='vertical' value={this.state.student.degree_extension_periods.map(ext => <Typography>Extended by {ext.period / 86400000} days ({ext.reason})</Typography>)} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField label='Extension Period (in days)' variant='filled' type='number' value={this.state.degree_extension_period} onChange={(e) => this.setState({ degree_extension_period: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField fullWidth label='Reason / Notification No.' variant='filled' value={this.state.degree_extension_reason} onChange={(e) => this.setState({ degree_extension_reason: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <CustomButton
                disabled={!Number(this.state.degree_extension_period) || !this.state.degree_extension_reason}
                label={'Extend Degree Time'}
                callingApiState={this.state.callingApi == 'extendDegreeTime'}
                variant='contained'
                onClick={() => this.setState({
                  confirmationModalShow: true,
                  confirmationModalMessage: `Are you sure you want to extend degree time for this student?`,
                  confirmationModalExecute: () => this.extendDegreeTime()
                })}
              />
            </Grid>
          </Grid>
        </CustomCard>
      )
    },
    Courses: () => {
      const columns = [
        { id: "course_id", label: "Course ID", format: (value) => value },
        { id: "course_name", label: "Course Name", format: (value) => value },
        { id: "course_type", label: "Course Type", format: (value) => convertUpper(value) },
        { id: "semester_season", label: "Semester Season", format: (value) => convertUpper(value) },
        { id: "semester_year", label: "Semester Year", format: (value) => value },
        { id: "department_name", label: "Department", format: (value) => value },
        { id: "teacher_name", label: "Instructor", format: (value) => value },
      ];
      return (
        <CustomCard>
          <Grid container>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h2">
                  Course Enrollments
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTable
                  margin='0px'
                  loadingState={this.state.studentCoursesArr == undefined}
                  onRowClick={(studentCourse) =>
                    this.props.navigate('/mis/semesters/courses/students/update', {
                      state: {
                        student_batch_id: this.student_batch_id,
                        sem_course_id: studentCourse.sem_course_id,
                        context_info: { ...studentCourse, ...this.state.student }
                      }
                    })
                  }
                  viewButtonLabel='Manage Course'

                  rows={this.state.studentCoursesArr}
                  columns={columns}
                />
              </Grid>
            </Grid>
          </Grid>
        </CustomCard>
      );
    }
  }

  render() {
    return (
      this.state.callingApi == 'fetchStudent' ? <LoadingIcon /> :
        <Grid container spacing={2}>
          <GoBackButton context={this.props.navigate} />
          <Grid item xs={12}>
            {this.cards.Info()}
          </Grid>
          <Grid item xs={12}>
            {this.cards.DegreeExtension()}
          </Grid>
          <Grid item xs={12}>
            {this.cards.Courses()}
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

export default withRouter(MisStudentsManagement);
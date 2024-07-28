/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../../components/FormGenerator';
import { socket } from '../../../../websocket/socket';
import { withRouter } from '../../../../withRouter';
import LoadingIcon from '../../../../components/LoadingIcon';
import GoBackButton from '../../../../components/GoBackButton';
import { Alert, Card, Grid, Zoom } from '@mui/material';
import ContextInfo from '../../../../components/ContextInfo';
import { MakeGETCall, MakePATCHCall } from '../../../../api';
import CustomSelect from '../../../../components/CustomSelect';
import CustomButton from '../../../../components/CustomButton';
import CustomCard from '../../../../components/CustomCard';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF',
  alertWarning: '#eb8f34',
  alertSuccess: 'green'
}

const defaultStyles = {
  container: {
    backgroundColor: 'white',
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
  alertBox: {
    warning: {
      width: '100%',
      borderRadius: 0,
      color: palletes.alertWarning, // text color
      borderColor: palletes.alertWarning,
      my: '10px',
      py: "5px",
      px: "10px",
      '& .MuiAlert-icon': {
        color: palletes.alertWarning, // icon color
      },
    },
    success: {
      width: '100%',
      borderRadius: 0,
      color: palletes.alertSuccess, // text color
      borderColor: palletes.alertSuccess,
      my: '10px',
      py: "5px",
      px: "10px",
      '& .MuiAlert-icon': {
        color: palletes.alertSuccess, // icon color
      },
    }
  }
}
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
    this.timeoutAlertRef = undefined
  }

  componentDidMount() {

    MakeGETCall('/api/semestersCourses', { query: { sem_course_id: this.sem_course_id } }).then(res => {
      const semestersCourses = res[0]
      console.log('setting state')
      this.setState({
        loading: false,
        semester_id: semestersCourses.semester_id,
        course_id: semestersCourses.course_id,
        teacher_id: semestersCourses.teacher_id,
        alertMsg: '',
        alertSeverity: '',
        callingApi: false
      })
    }).catch(console.error)

    // socket.emit('semestersCourses/fetch', { sem_course_id: this.sem_course_id }, (res) => {
    //   console.log('[semestersCourses/fetch] response:', res)
    //   if (res.code == 200) {
    //     const semestersCourses = res.data[0]
    //     console.log('setting state')
    //     this.setState({
    //       loading: false,
    //       semester_id: semestersCourses.semester_id,
    //       course_id: semestersCourses.course_id,
    //       teacher_id: semestersCourses.teacher_id,
    //     })
    //   }
    // })
  }

  timeoutAlert = () => {
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 5000)
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
            <CustomCard>
              <Grid container gap={2}>
                <Grid item xs={6}>
                  <CustomSelect
                    value={this.state.teacher_id}
                    endpoint={'/api/autocomplete/teachers'}
                    label={'Teacher'}
                    onChange={(e, option) => this.setState({ teacher_id: option.id })}
                    required={true}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                    <Alert variant="outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                  </Zoom>
                </Grid>
                <Grid item>
                  <CustomButton
                    label={'Update'}
                    disabled={this.state.callingApi}
                    onClick={() => {
                      this.setState({ callingApi: true })
                      MakePATCHCall(`/api/semestersCourses/${this.sem_course_id}/updateTeacher`, { body: { teacher_id: this.state.teacher_id } }).then(res => {
                        this.setState({
                          alertMsg: 'Teacher updated',
                          alertSeverity: 'success'
                        }, this.timeoutAlert)
                      }).catch(err => {
                        this.setState({
                          alertMsg: `Error ${err.code}: ${err.message}`,
                          alertSeverity: 'warning'
                        }, this.timeoutAlert)
                      }).finally(() => this.setState({ callingApi: false }))
                      // socket.emit(`${this.props.endpoint}/${this.props.formType}`, this.state.formFields, res => {
                      //   this.setState({ callingApi: false })
                      //   console.log(`[${this.props.endpoint}/${this.props.formType}] response`, res)
                      //   this.setState({
                      //     alertMsg: res.code == 200 ? this.props.submitSuccessMessage : `${res.status}: ${res.message}`,
                      //     alertSeverity: res.code == 200 ? 'success' : 'warning'
                      //   }, this.timeoutAlert)
                      // })
                    }}
                  />
                </Grid>
              </Grid>
            </CustomCard>
          </Grid>
        </Grid>
    );
  }
}

export default withRouter(MisSemestersCoursesUpdate);
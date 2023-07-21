/* eslint eqeqeq: "off", no-unused-vars: "off", no-useless-constructor: "off" */
import React from 'react';
import FormGenerator from '../../../components/FormGenerator';
import { socket } from '../../../websocket/socket';
import { withRouter } from '../../../withRouter';
import LoadingIcon from '../../../components/LoadingIcon';
import { Grid, Typography, Zoom, Alert, RadioGroup, Radio, FormControlLabel, FormControl, FormLabel, Chip, TextField, Checkbox, CircularProgress } from '@mui/material';
import GoBackButton from '../../../components/GoBackButton';
import CustomCard from '../../../components/CustomCard';
import CustomTextField from '../../../components/CustomTextField';
import CustomSelect from '../../../components/CustomSelect';
import CustomButton from '../../../components/CustomButton';
import CustomFilesField from '../../../components/CustomFilesField';
import InstructionsField from '../../../components/InstructionsField';
import { Navigate } from 'react-router';
import ContextInfo from '../../../components/ContextInfo';
import CustomModal from '../../../components/CustomModal';
import MisThesisExaminers from './MisThesisExaminers';
import { getUserNameById } from '../../../objects/Users_List';
import { timeLocale } from '../../../objects/Time';
import CustomAlert from '../../../components/CustomAlert';

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

class MisThesisGrading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student_thesis: undefined,
      savingChanges: false,

      alertMsg: '',
      alertSeverity: 'info',

      callingApi: 'fetchStudentThesis',

      refreshExaminers: false,
      thesisExaminersOpen: false,
      thesisExaminersType: '',
    }
    this.student_batch_id = this.props.location.state.student_batch_id
    this.context_info = this.props.location.state.context_info
  }

  componentDidMount() {
    this.fetchStudentThesis()
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({ alertMsg: '' })
    }, 3000);
  }

  updateAlertMsg = ({ apiRes, successMsg, errorMsg, rawMsg }) => {
    if (rawMsg) return this.setState({ alertMsg: apiRes, alertSeverity: 'warning' })
    if (apiRes.code == 200 && !successMsg) return
    this.setState({
      alertMsg: apiRes.code == 200 ? successMsg : errorMsg || `${apiRes.status}: ${apiRes.message}`,
      alertSeverity: apiRes.code == 200 ? 'success' : 'warning'
    })
  }

  fetchStudentThesis = () => {
    this.setState({ callingApi: 'fetchStudentThesis' })
    socket.emit('studentsThesis/fetch', { student_batch_id: this.student_batch_id }, (res) => {
      this.setState({ callingApi: '' })
      if (res.code == 200) {
        this.setState({
          student_thesis: res.data[0]
        })
      }
    })
  }

  updateGrade = () => {
    this.setState({ callingApi: 'updateGrade' })
    socket.emit('studentsThesis/updateGrade', { student_batch_id: this.student_batch_id, grade: this.state.student_thesis.grade, completion_timestamp: this.state.student_thesis.completion_timestamp }, (res) => {
      this.setState({ callingApi: '' })
      this.updateAlertMsg({ apiRes: res, successMsg: 'Grade Assigned!' })
      this.fetchStudentThesis()
    })
  }

  render() {
    return (
      this.state.callingApi == 'fetchStudentThesis' ? <LoadingIcon /> :
        !this.state.student_thesis ? <Typography variant='h4'>No Thesis Found</Typography> :
          <Grid container spacing={2}>
            <GoBackButton context={this.props.navigate} />
            <Grid item xs={12}>
              <ContextInfo contextInfo={this.context_info} />
            </Grid>
            <Grid item xs={12}>
              <CustomCard>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h2">Grade Student's Thesis</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontWeight={'bold'}>Current Grade: {this.state.student_thesis.grade}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontWeight={'bold'}>Grade Logs:</Typography>
                  </Grid>
                  <Grid item xs={12} marginLeft={3}>
                    {this.state.student_thesis.grade_change_logs.map((log, index) =>
                      <Typography key={index}>
                        Grade {log.split(' ')[2]} assigned by {getUserNameById(log.split(' ')[1])} on {new Date(Number(log.split(' ')[0])).toLocaleDateString(...timeLocale)}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={'auto'}>
                    <CustomSelect
                      sx={{ minWidth: '250px' }}
                      required
                      label="Change Grade"
                      value={this.state.student_thesis.grade}
                      menuItems={[{ id: 'N', label: 'Audit (N)' }, { id: 'S', label: 'Satisfactory (S)' }, { id: 'U', label: 'Unsatisfactory (U)' }, { id: 'I', label: 'Incomplete (I)' },]}
                      onChange={(e, option) => this.setState(state => ({ student_thesis: { ...state.student_thesis, grade: option?.id || 'N' } }))}
                    />
                  </Grid>
                  <Grid item xs={'auto'}>
                    <CustomTextField
                      type="date"
                      sx={{ width: '200px' }}
                      InputLabelProps={{ shrink: true }}
                      label='Completion Date'
                      value={this.state.student_thesis.completion_timestamp ? new Date(Number(this.state.student_thesis.completion_timestamp)).toISOString().split('T')[0] : null}
                      onChange={(e) => this.setState({ student_thesis: { ...this.state.student_thesis, completion_timestamp: new Date(e.target.value).getTime() } })} />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
                  </Grid>
                  <Grid item xs={'auto'}>
                    <CustomButton label='Assign Grade' callingApiState={this.state.callingApi == 'updateGrade'} onClick={this.updateGrade} />
                  </Grid>
                  <Grid item xs={'auto'}>
                    <CustomButton variant='outlined' label='Reset' callingApiState={this.state.callingApi == 'fetchStudentThesis'} onClick={this.fetchStudentThesis} />
                  </Grid>
                </Grid>
              </CustomCard>
            </Grid>
          </Grid>
    );
  }
}

export default withRouter(MisThesisGrading);
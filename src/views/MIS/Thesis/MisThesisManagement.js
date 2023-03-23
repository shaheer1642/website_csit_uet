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

class MisThesisManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      student_thesis: {},
      savingChanges: false,

      alertMsg: '',
      alertSeverity: 'warning',
    }
    this.student_batch_id = this.props.location.state.student_batch_id
    this.thesis_info = this.props.location.state.thesis_info

    this.timeoutAlertRef = null

    this.updatedKeys = []
  }

  componentDidMount() {
    this.fetchStudentThesis()
    socket.addEventListener("studentsThesis/listener/changed",this.studentsThesisListenerChanged);
  }

  componentWillUnmount() {
    socket.removeEventListener("studentsThesis/listener/changed",this.studentsThesisListenerChanged);
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  fetchStudentThesis = () => {
    socket.emit('studentsThesis/fetch', {student_batch_id: this.student_batch_id}, (res) => {
      console.log(res)
      if (res.code == 200) {
        this.setState({
          loading: false,
          student_thesis: {...res.data[0]}
        })
      }
    })
  }

  studentsThesisListenerChanged = (data) => {
    this.fetchStudentThesis()
  };

  updateStudentThesis = (key, value) => {
    if (!this.updatedKeys.includes(key)) this.updatedKeys.push(key)
    this.setState({
      student_thesis: {...this.state.student_thesis, [key]: value}
    })
  }

  fileUploadHandler = (key, e) => {
    if (!this.updatedKeys.includes(key)) this.updatedKeys.push(key)
    e.preventDefault()
    this.setState({
      student_thesis: {...this.state.student_thesis, [key]: [...this.state.student_thesis[key], ...Array.from(e.target.files).map(file => ({document: file, document_name: file.name}))]}
    }, () => console.log('fileUploadHandler',this.state.student_thesis))
    e.target.value = null
  }

  fileDeleteHandler = (key, index) => {
    if (!this.updatedKeys.includes(key)) this.updatedKeys.push(key)
    this.setState({
      student_thesis: {...this.state.student_thesis, [key]: [...this.state.student_thesis[key].filter((doc,i) => i != index)]}
    })
  }

  timeoutAlert = () => {
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 5000)
  }

  render() {
    return (
      this.state.loading ? <LoadingIcon />:
      <Grid container rowSpacing={"20px"}>
        <GoBackButton context={this.props.navigate}/>
        {/* Thesis basic info */}
        <Grid item xs={12}>
          <CustomCard
          style={{padding: '10px'}}
          cardContent= {
            <Grid container rowSpacing={"20px"} columnSpacing={"20px"} direction='row'>
              <Grid item xs={12}>
                <Typography variant='h3'>{this.thesis_info}</Typography>
              </Grid>
              <Grid item xs={'auto'}>
                <CustomTextField 
                  value={this.state.student_thesis.thesis_title}
                  variant="filled" 
                  label={'Thesis Title'}
                  onChange={(e) => this.updateStudentThesis('thesis_title',e.target.value)} />
              </Grid>
              <Grid item xs={'auto'}>
                <FormControl disabled>
                  <FormLabel>{'Thesis Type'}</FormLabel>
                  <RadioGroup row value={this.state.student_thesis.thesis_type} onChange={(e) => this.updateStudentThesis('thesis_type',e.target.value)}>
                    <FormControlLabel value='research' label='Research' control={<Radio />}/>
                    <FormControlLabel value='project' label='Project' control={<Radio />}/>
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={2}>
                <CustomSelect 
                  defaultValue={this.state.student_thesis.supervisor_id}
                  endpoint='autocomplete/teachers'
                  label='Supervisor'
                  onChange={(e) => this.updateStudentThesis('supervisor_id',e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomSelect 
                  defaultValue={this.state.student_thesis.co_supervisor_id}
                  endpoint='autocomplete/teachers'
                  label='Co-Supervisor'
                  onChange={(e) => this.updateStudentThesis('co_supervisor_id',e.target.value)}
                />
              </Grid>
              <Grid item xs={'auto'}>
                <CustomTextField 
                  value={this.state.student_thesis.internal_examiner}
                  variant="filled" 
                  label={'Internal Examiner'}
                  onChange={(e) => this.updateStudentThesis('internal_examiner',e.target.value)} />
              </Grid>
              <Grid item xs={'auto'}>
                <CustomTextField 
                  value={this.state.student_thesis.external_examiner}
                  variant="filled" 
                  label={'External Examiner'}
                  onChange={(e) => this.updateStudentThesis('external_examiner',e.target.value)} />
              </Grid>
            </Grid>
          }></CustomCard>
        </Grid>
        {/* Step 1: Proposal */}
        <Grid item xs={12}>
          <CustomCard
          style={{padding: '10px'}}
          cardContent= {
            <Grid container rowSpacing={"20px"} columnSpacing={"20px"} direction='row'>
              <Grid item xs={12}>
                <Typography variant='h3' display='flex' alignItems='center'>
                  {'Proposal Submission'}  
                  <Chip 
                    style={{marginLeft: '10px',color: this.state.student_thesis.proposal_completed ? 'green' : 'orange', borderColor: this.state.student_thesis.proposal_completed ? 'green' : 'orange'}} 
                    label={this.state.student_thesis.proposal_completed ? 'Completed':'In-Progress'} 
                    variant="outlined" />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <InstructionsField instruction_id={1} instruction_detail_key='proposal_documents' />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="date"
                  label='BOASAR Notification Date'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={this.state.student_thesis.boasar_notification_timestamp ? new Date(Number(this.state.student_thesis.boasar_notification_timestamp)).toISOString().split('T')[0] : null}
                  onChange={(e) => this.updateStudentThesis('boasar_notification_timestamp',new Date(e.target.value).getTime())} />
              </Grid>
              <Grid item xs={12}>
                <CustomFilesField 
                  label="Attached Documents" 
                  documents={this.state.student_thesis.proposal_documents}
                  onChange={(e) => this.fileUploadHandler('proposal_documents', e)}
                  onDelete={(file) => this.fileDeleteHandler('proposal_documents', file)} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel 
                  style={{userSelect: 'none'}}
                  control={<Checkbox checked={this.state.student_thesis.proposal_completed} 
                  onChange={(e) => this.updateStudentThesis('proposal_completed',e.target.checked)} />} 
                  label={'Mark as Completed'} />
              </Grid>
            </Grid>
          }></CustomCard>
        </Grid>

        <Grid item xs={12}>
          <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
            <Alert variant="outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
          </Zoom>
        </Grid>
        <Grid item xs={12}>
          <CustomButton 
            startIcon={this.state.savingChanges ? <CircularProgress size='14px'/> : undefined}
            disabled={this.state.savingChanges ? true : false}
            label='Save changes'
            onClick={() => {
              this.setState({savingChanges: true})
              socket.emit(`studentsThesis/update`, Object.keys(this.state.student_thesis).filter(key => this.updatedKeys.includes(key) || key == 'student_batch_id').reduce((obj, key) => {obj[key] = this.state.student_thesis[key];return obj;}, {}), res => {
                this.setState({
                  savingChanges: false,
                  alertMsg: res.code == 200 ? 'Saved changes!':`${res.status}: ${res.message}`,
                  alertSeverity: res.code == 200 ? 'success':'warning'
                }, this.timeoutAlert)
                this.updatedKeys = []
                this.fetchStudentThesis()
            })
            }}
          />
        </Grid>
      </Grid>

    );
  }
}

export default withRouter(MisThesisManagement);
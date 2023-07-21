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

      refreshExaminers: false,
      thesisExaminersOpen: false,
      thesisExaminersType: '',
    }
    this.student_batch_id = this.props.location.state?.student_batch_id || this.props.location.state?.student_batch?.student_batch_id
    this.context_info = this.props.location.state?.context_info
    this.student_view = this.props.user.user_type == 'student'
    this.teacher_view = this.props.user.user_type == 'teacher'

    this.timeoutAlertRef = null

    this.updatedKeys = []
  }

  componentDidMount() {
    this.fetchStudentThesis()
    socket.addEventListener("studentsThesis/listener/changed", this.studentsThesisListenerChanged);
  }

  componentWillUnmount() {
    socket.removeEventListener("studentsThesis/listener/changed", this.studentsThesisListenerChanged);
  }

  componentDidUpdate() {
  }

  fetchStudentThesis = () => {
    socket.emit('studentsThesis/fetch', { student_batch_id: this.student_batch_id }, (res) => {
      if (res.code == 200) {
        this.setState({
          loading: false,
          student_thesis: res.data[0] || {}
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
      student_thesis: { ...this.state.student_thesis, [key]: value }
    })
  }

  fileUploadHandler = (key, e) => {
    if (!this.updatedKeys.includes(key)) this.updatedKeys.push(key)
    e.preventDefault()
    this.setState({
      student_thesis: { ...this.state.student_thesis, [key]: [...this.state.student_thesis[key], ...Array.from(e.target.files).map(file => ({ document: file, document_name: file.name }))] }
    }, () => console.log('fileUploadHandler', this.state.student_thesis))
    e.target.value = null
  }

  fileDeleteHandler = (key, index) => {
    if (!this.updatedKeys.includes(key)) this.updatedKeys.push(key)
    this.setState({
      student_thesis: { ...this.state.student_thesis, [key]: [...this.state.student_thesis[key].filter((doc, i) => i != index)] }
    })
  }

  timeoutAlert = () => {
    clearTimeout(this.timeoutAlertRef)
    this.timeoutAlertRef = setTimeout(() => this.setState({ alertMsg: '' }), 5000)
  }

  addExaminer = (callback) => {
    if (!this.state.thesisExaminersType) return callback ? callback() : null
    this.setState({ addingExaminer: true })
    socket.emit('studentsThesisExaminers/create', {
      examiner_name: this.state.addExaminerName,
      examiner_university: this.state.addExaminerUniversity,
      examiner_designation: this.state.addExaminerDesignation,
      examiner_type: this.state.thesisExaminersType
    }, (res) => {
      this.setState({ addingExaminer: false })
      if (callback) callback()
    })
  }

  render() {
    if (this.student_view && !this.student_batch_id) return <Navigate to='/mis/sportal/batches' state={{ ...this.props.location?.state, redirect: '/mis/thesis/manage', student_id: this.props.user?.user_id }} />
    return (
      this.state.loading ? <LoadingIcon /> :
        Object.keys(this.state.student_thesis) == 0 ? <Typography variant='h4'>No Thesis Found</Typography> :
          <Grid container spacing={2} columnSpacing={'10px'}>
            <GoBackButton context={this.props.navigate} />
            <Grid item xs={12}>
              <ContextInfo contextInfo={this.context_info} />
            </Grid>
            {/* Thesis basic info */}
            <Grid item xs={12}>
              <CustomCard>
                <Grid container spacing={2} direction='row'>
                  <Grid item xs={12}>
                    <Typography variant='h3'>Thesis Report</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      fullWidth
                      readOnly={this.student_view || this.teacher_view}
                      value={this.state.student_thesis.thesis_title}
                      variant="filled"
                      label={'Thesis Title'}
                      onChange={(e) => this.updateStudentThesis('thesis_title', e.target.value)} />
                  </Grid>
                  <Grid item xs={'auto'}>
                    <FormControl disabled>
                      <FormLabel>{'Thesis Type'}</FormLabel>
                      <RadioGroup row value={this.state.student_thesis.thesis_type} onChange={(e) => this.updateStudentThesis('thesis_type', e.target.value)}>
                        <FormControlLabel value='research' label='Research' control={<Radio />} />
                        {this.state.student_thesis.degree_type == 'ms' ? <FormControlLabel value='project' label='Project' control={<Radio />} /> : <></>}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={'auto'}>
                    <CustomTextField
                      readOnly={true}
                      value={this.state.student_thesis.grade}
                      variant="filled"
                      label={'Grade'} />
                  </Grid>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={'auto'}>
                    <CustomSelect
                      readOnly={this.student_view || this.teacher_view}
                      menuItems={[{ id: '', label: 'None' }]}
                      endpoint='autocomplete/teachers'
                      label='Supervisor'
                      onChange={(e, option) => this.updateStudentThesis('supervisor_id', option.id)}
                      value={this.state.student_thesis.supervisor_id || ''}
                    />
                  </Grid>
                  <Grid item xs={'auto'}>
                    <CustomSelect
                      readOnly={this.student_view || this.teacher_view}
                      menuItems={[{ id: '', label: 'None' }]}
                      endpoint='autocomplete/studentsThesisExaminers'
                      label='Co-Supervisor'
                      onChange={(e, option) => this.updateStudentThesis('co_supervisor_id', option.id)}
                      value={this.state.student_thesis.co_supervisor_id || ''}
                    />
                  </Grid>
                  {
                    this.state.student_thesis.degree_type == 'ms' && this.state.student_thesis.thesis_type == 'research' ?
                      <React.Fragment>
                        <Grid item xs={'auto'}>
                          <CustomSelect
                            readOnly={this.student_view || this.teacher_view}
                            label="Internal Examiner"
                            fieldType='select'
                            forceCallApi={this.state.refreshExaminers ? () => this.setState({ refreshExaminers: false }) : undefined}
                            menuItems={[{ id: 'add_option', label: '+ Add New' }, { id: '', label: 'None' }]}
                            endpoint='autocomplete/studentsThesisExaminers'
                            endpointData={{ examiner_type: 'internal_examiner' }}
                            sx={{ minWidth: '300px' }}
                            onChange={(e, option) => {
                              if (option.id == 'add_option') return this.setState({ thesisExaminersOpen: true, thesisExaminersType: 'internal_examiner' })
                              this.updateStudentThesis('internal_examiner', option.id)
                            }}
                            value={this.state.student_thesis.internal_examiner || ''}
                          />
                        </Grid>
                        <Grid item xs={'auto'}>
                          <CustomSelect
                            readOnly={this.student_view || this.teacher_view}
                            label="External Examiner"
                            fieldType='select'
                            forceCallApi={this.state.refreshExaminers ? () => this.setState({ refreshExaminers: false }) : undefined}
                            menuItems={[{ id: 'add_option', label: '+ Add New' }, { id: '', label: 'None' }]}
                            endpoint='autocomplete/studentsThesisExaminers'
                            endpointData={{ examiner_type: 'external_examiner' }}
                            sx={{ minWidth: '300px' }}
                            onChange={(e, option) => {
                              if (option.id == 'add_option') return this.setState({ thesisExaminersOpen: true, thesisExaminersType: 'external_examiner' })
                              this.updateStudentThesis('external_examiner', option.id)
                            }}
                            value={this.state.student_thesis.external_examiner || ''}
                          />
                        </Grid>
                      </React.Fragment> : <></>
                  }
                  {
                    this.state.student_thesis.degree_type == 'phd' && this.state.student_thesis.thesis_type == 'research' ?
                      <React.Fragment>
                        <Grid item xs={'auto'}>
                          <CustomSelect
                            readOnly={this.student_view || this.teacher_view}
                            label="Examiner (Within Dept.)"
                            fieldType='select'
                            forceCallApi={this.state.refreshExaminers ? () => this.setState({ refreshExaminers: false }) : undefined}
                            menuItems={[{ id: 'add_option', label: '+ Add New' }, { id: '', label: 'None' }]}
                            endpoint='autocomplete/studentsThesisExaminers'
                            endpointData={{ examiner_type: 'internal_examiner' }}
                            sx={{ minWidth: '300px' }}
                            onChange={(e, option) => {
                              if (option.id == 'add_option') return this.setState({ thesisExaminersOpen: true, thesisExaminersType: 'internal_examiner' })
                              this.updateStudentThesis('examiner_within_department', option.id)
                            }}
                            value={this.state.student_thesis.examiner_within_department || ''}
                          />
                        </Grid>
                        <Grid item xs={'auto'}>
                          <CustomSelect
                            readOnly={this.student_view || this.teacher_view}
                            label="Examiner (Outside Dept.)"
                            fieldType='select'
                            forceCallApi={this.state.refreshExaminers ? () => this.setState({ refreshExaminers: false }) : undefined}
                            menuItems={[{ id: 'add_option', label: '+ Add New' }, { id: '', label: 'None' }]}
                            endpoint='autocomplete/studentsThesisExaminers'
                            endpointData={{ examiner_type: 'internal_examiner' }}
                            sx={{ minWidth: '300px' }}
                            onChange={(e, option) => {
                              if (option.id == 'add_option') return this.setState({ thesisExaminersOpen: true, thesisExaminersType: 'internal_examiner' })
                              this.updateStudentThesis('examiner_outside_department', option.id)
                            }}
                            value={this.state.student_thesis.examiner_outside_department || ''}
                          />
                        </Grid>
                        <Grid item xs={'auto'}>
                          <CustomSelect
                            readOnly={this.student_view || this.teacher_view}
                            label="Examiner (Outside University)"
                            fieldType='select'
                            forceCallApi={this.state.refreshExaminers ? () => this.setState({ refreshExaminers: false }) : undefined}
                            menuItems={[{ id: 'add_option', label: '+ Add New' }, { id: '', label: 'None' }]}
                            endpoint='autocomplete/studentsThesisExaminers'
                            endpointData={{ examiner_type: 'external_examiner' }}
                            sx={{ minWidth: '300px' }}
                            onChange={(e, option) => {
                              if (option.id == 'add_option') return this.setState({ thesisExaminersOpen: true, thesisExaminersType: 'external_examiner' })
                              this.updateStudentThesis('examiner_outside_university', option.id)
                            }}
                            value={this.state.student_thesis.examiner_outside_university || ''}
                          />
                        </Grid>
                        <Grid item xs={'auto'}>
                          <CustomSelect
                            readOnly={this.student_view || this.teacher_view}
                            label="Examiner (Industry)"
                            fieldType='select'
                            forceCallApi={this.state.refreshExaminers ? () => this.setState({ refreshExaminers: false }) : undefined}
                            menuItems={[{ id: 'add_option', label: '+ Add New' }, { id: '', label: 'None' }]}
                            endpoint='autocomplete/studentsThesisExaminers'
                            endpointData={{ examiner_type: 'external_examiner' }}
                            sx={{ minWidth: '300px' }}
                            onChange={(e, option) => {
                              if (option.id == 'add_option') return this.setState({ thesisExaminersOpen: true, thesisExaminersType: 'external_examiner' })
                              this.updateStudentThesis('examiner_from_industry', option.id)
                            }}
                            value={this.state.student_thesis.examiner_from_industry || ''}
                          />
                        </Grid>
                        <Grid item xs={'auto'}>
                          <CustomSelect
                            readOnly={this.student_view || this.teacher_view}
                            label="Foreign Thesis Evaluator 1"
                            fieldType='select'
                            forceCallApi={this.state.refreshExaminers ? () => this.setState({ refreshExaminers: false }) : undefined}
                            menuItems={[{ id: 'add_option', label: '+ Add New' }, { id: '', label: 'None' }]}
                            endpoint='autocomplete/studentsThesisExaminers'
                            endpointData={{ examiner_type: 'foreign_examiner' }}
                            sx={{ minWidth: '300px' }}
                            onChange={(e, option) => {
                              if (option.id == 'add_option') return this.setState({ thesisExaminersOpen: true, thesisExaminersType: 'foreign_examiner' })
                              this.updateStudentThesis('foreign_thesis_evaluator_1', option.id)
                            }}
                            value={this.state.student_thesis.foreign_thesis_evaluator_1 || ''}
                          />
                        </Grid>
                        <Grid item xs={'auto'}>
                          <CustomSelect
                            readOnly={this.student_view || this.teacher_view}
                            label="Foreign Thesis Evaluator 2"
                            fieldType='select'
                            forceCallApi={this.state.refreshExaminers ? () => this.setState({ refreshExaminers: false }) : undefined}
                            menuItems={[{ id: 'add_option', label: '+ Add New' }, { id: '', label: 'None' }]}
                            endpoint='autocomplete/studentsThesisExaminers'
                            endpointData={{ examiner_type: 'foreign_examiner' }}
                            sx={{ minWidth: '300px' }}
                            onChange={(e, option) => {
                              if (option.id == 'add_option') return this.setState({ thesisExaminersOpen: true, thesisExaminersType: 'foreign_examiner' })
                              this.updateStudentThesis('foreign_thesis_evaluator_2', option.id)
                            }}
                            value={this.state.student_thesis.foreign_thesis_evaluator_2 || ''}
                          />
                        </Grid>
                      </React.Fragment> : <></>
                  }
                  {this.props.user.user_type == 'pga' ?
                    <Grid item xs={12}>
                      <CustomButton
                        label='Grade Management'
                        variant='outlined'
                        onClick={() => this.props.navigate('/mis/thesis/grading', { state: this.props.location.state })}
                      />
                    </Grid> : <></>
                  }
                </Grid>
              </CustomCard>
            </Grid>
            {
              this.state.student_thesis.degree_type == 'ms' && this.state.student_thesis.thesis_type == 'research' ?
                <React.Fragment>
                  {/* Phase 1: Proposal Submission */}
                  <Grid item xs={12}>
                    <CustomCard>
                      <Grid container spacing={2} direction='row'>
                        <Grid item xs={12}>
                          <Typography variant='h3' display='flex' alignItems='center'>
                            {'Phase 1: Proposal Submission'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} marginTop={'20px'}>
                          <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                        </Grid>
                        <Grid item xs={12} marginLeft={'20px'}>
                          <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='ms_research_proposal' />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomTextField
                            type="date"
                            sx={{ width: '200px' }}
                            InputLabelProps={{ shrink: true }}
                            label='BOASAR Notification Date'
                            readOnly={this.student_view || this.teacher_view}
                            value={this.state.student_thesis.boasar_notification_timestamp ? new Date(Number(this.state.student_thesis.boasar_notification_timestamp)).toISOString().split('T')[0] : ''}
                            onChange={(e) => this.updateStudentThesis('boasar_notification_timestamp', new Date(e.target.value).getTime())} />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFilesField
                            readOnly={this.student_view || this.teacher_view}
                            label="Attached Documents"
                            documents={this.state.student_thesis.phase_1_documents}
                            onChange={(e) => this.fileUploadHandler('phase_1_documents', e)}
                            onDelete={(file) => this.fileDeleteHandler('phase_1_documents', file)} />
                        </Grid>
                        {/* <Grid item xs={12}>
                    <FormControlLabel 
                      style={{userSelect: 'none'}}
                      control={<Checkbox checked={this.state.student_thesis.proposal_completed} 
                      onChange={(e) => this.updateStudentThesis('proposal_completed',e.target.checked)} />} 
                      label={'Mark as Completed'} />
                  </Grid> */}
                      </Grid>
                    </CustomCard>
                  </Grid>
                  {/* Phase 2: Pre-Defense */}
                  <Grid item xs={12}>
                    <CustomCard>
                      <Grid container spacing={2} direction='row'>
                        <Grid item xs={12}>
                          <Typography variant='h3' display='flex' alignItems='center'>
                            {'Phase 2: Pre-Defense'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} marginTop={'20px'}>
                          <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                        </Grid>
                        <Grid item xs={12} marginLeft={'20px'}>
                          <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='ms_research_thesis_defense' />
                        </Grid>
                        <Grid item xs={'auto'}>
                          <CustomTextField
                            type="date"
                            sx={{ width: '200px' }}
                            InputLabelProps={{ shrink: true }}
                            label='Committee Notification Date'
                            readOnly={this.student_view || this.teacher_view}
                            value={this.state.student_thesis.committee_notification_timestamp ? new Date(Number(this.state.student_thesis.committee_notification_timestamp)).toISOString().split('T')[0] : ''}
                            onChange={(e) => this.updateStudentThesis('committee_notification_timestamp', new Date(e.target.value).getTime())} />
                        </Grid>
                        <Grid item xs={'auto'}>
                          <CustomTextField
                            type="date"
                            sx={{ width: '200px' }}
                            InputLabelProps={{ shrink: true }}
                            label='Thesis Defense Date'
                            readOnly={this.student_view || this.teacher_view}
                            value={this.state.student_thesis.defense_day_timestamp ? new Date(Number(this.state.student_thesis.defense_day_timestamp)).toISOString().split('T')[0] : ''}
                            onChange={(e) => this.updateStudentThesis('defense_day_timestamp', new Date(e.target.value).getTime())} />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFilesField
                            readOnly={this.student_view || this.teacher_view}
                            label="Attached Documents"
                            documents={this.state.student_thesis.phase_2_documents}
                            onChange={(e) => this.fileUploadHandler('phase_2_documents', e)}
                            onDelete={(file) => this.fileDeleteHandler('phase_2_documents', file)} />
                        </Grid>
                      </Grid>
                    </CustomCard>
                  </Grid>
                  {/* Phase 3: Post-Defense */}
                  <Grid item xs={12}>
                    <CustomCard>
                      <Grid container spacing={2} direction='row'>
                        <Grid item xs={12}>
                          <Typography variant='h3' display='flex' alignItems='center'>
                            {'Phase 3: Post-Defense'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} marginTop={'20px'}>
                          <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                        </Grid>
                        <Grid item xs={12} marginLeft={'20px'}>
                          <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='ms_research_post_defense' />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomFilesField
                            readOnly={this.student_view || this.teacher_view}
                            label="Attached Documents"
                            documents={this.state.student_thesis.phase_3_documents}
                            onChange={(e) => this.fileUploadHandler('phase_3_documents', e)}
                            onDelete={(file) => this.fileDeleteHandler('phase_3_documents', file)} />
                        </Grid>
                      </Grid>
                    </CustomCard>
                  </Grid>
                </React.Fragment>
                :
                this.state.student_thesis.degree_type == 'ms' && this.state.student_thesis.thesis_type == 'project' ?
                  <React.Fragment>
                    {/* Phase 1: Proposal Submission */}
                    <Grid item xs={12}>
                      <CustomCard>
                        <Grid container spacing={2} direction='row'>
                          <Grid item xs={12}>
                            <Typography variant='h3' display='flex' alignItems='center'>
                              {'Phase 1: Proposal Submission'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} marginTop={'20px'}>
                            <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                          </Grid>
                          <Grid item xs={12} marginLeft={'20px'}>
                            <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='ms_project_proposal' />
                          </Grid>
                          <Grid item xs={'auto'}>
                            <CustomTextField
                              type="date"
                              sx={{ width: '200px' }}
                              InputLabelProps={{ shrink: true }}
                              label='BOASAR Notification Date'
                              readOnly={this.student_view || this.teacher_view}
                              value={this.state.student_thesis.boasar_notification_timestamp ? new Date(Number(this.state.student_thesis.boasar_notification_timestamp)).toISOString().split('T')[0] : ''}
                              onChange={(e) => this.updateStudentThesis('boasar_notification_timestamp', new Date(e.target.value).getTime())} />
                          </Grid>
                          <Grid item xs={'auto'}>
                            <CustomTextField
                              type="date"
                              sx={{ width: '200px' }}
                              InputLabelProps={{ shrink: true }}
                              label='Proposal Submission Date'
                              readOnly={this.student_view || this.teacher_view}
                              value={this.state.student_thesis.proposal_submission_timestamp ? new Date(Number(this.state.student_thesis.proposal_submission_timestamp)).toISOString().split('T')[0] : ''}
                              onChange={(e) => this.updateStudentThesis('proposal_submission_timestamp', new Date(e.target.value).getTime())} />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFilesField
                              readOnly={this.student_view || this.teacher_view}
                              label="Attached Documents"
                              documents={this.state.student_thesis.phase_1_documents}
                              onChange={(e) => this.fileUploadHandler('phase_1_documents', e)}
                              onDelete={(file) => this.fileDeleteHandler('phase_1_documents', file)} />
                          </Grid>
                        </Grid>
                      </CustomCard>
                    </Grid>
                    {/* Phase 2: Thesis Submission */}
                    <Grid item xs={12}>
                      <CustomCard>
                        <Grid container spacing={2} direction='row'>
                          <Grid item xs={12}>
                            <Typography variant='h3' display='flex' alignItems='center'>
                              {'Phase 2: Thesis Submission'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} marginTop={'20px'}>
                            <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                          </Grid>
                          <Grid item xs={12} marginLeft={'20px'}>
                            <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='ms_project_thesis_submission' />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFilesField
                              readOnly={this.student_view || this.teacher_view}
                              label="Attached Documents"
                              documents={this.state.student_thesis.phase_2_documents}
                              onChange={(e) => this.fileUploadHandler('phase_2_documents', e)}
                              onDelete={(file) => this.fileDeleteHandler('phase_2_documents', file)} />
                          </Grid>
                        </Grid></CustomCard>
                    </Grid>
                    {/* Phase 3: Post-Thesis */}
                    <Grid item xs={12}>
                      <CustomCard>
                        <Grid container>
                          <Grid item xs={12}>
                            <Typography variant='h3' display='flex' alignItems='center'>
                              {'Phase 3: Post-Thesis'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} marginTop={'20px'}>
                            <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                          </Grid>
                          <Grid item xs={12} marginLeft={'20px'}>
                            <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='ms_project_post_thesis' />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomFilesField
                              readOnly={this.student_view || this.teacher_view}
                              label="Attached Documents"
                              documents={this.state.student_thesis.phase_3_documents}
                              onChange={(e) => this.fileUploadHandler('phase_3_documents', e)}
                              onDelete={(file) => this.fileDeleteHandler('phase_3_documents', file)} />
                          </Grid>
                        </Grid>
                      </CustomCard>
                    </Grid>
                  </React.Fragment>
                  :
                  this.state.student_thesis.degree_type == 'phd' && this.state.student_thesis.thesis_type == 'research' ?
                    <React.Fragment>
                      {/* Phase 0: Qualifying Exam */}
                      <Grid item xs={12}>
                        <CustomCard>
                          <Grid container spacing={2} direction='row'>
                            <Grid item xs={12}>
                              <Typography variant='h3'>{'Phase 0: Qualifying Exam'}</Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={'20px'}>
                              <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                            </Grid>
                            <Grid item xs={12} marginLeft={'20px'}>
                              <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='phd_research_qualifying_exam' />
                            </Grid>
                            <Grid item xs={'auto'}>
                              <CustomTextField
                                type="date"
                                sx={{ width: '200px' }}
                                InputLabelProps={{ shrink: true }}
                                label='QE Notification Date'
                                readOnly={this.student_view || this.teacher_view}
                                value={this.state.student_thesis.qe_notification_timestamp ? new Date(Number(this.state.student_thesis.qe_notification_timestamp)).toISOString().split('T')[0] : ''}
                                onChange={(e) => this.updateStudentThesis('qe_notification_timestamp', new Date(e.target.value).getTime())} />
                            </Grid>
                            <Grid item xs={'auto'}>
                              <CustomTextField
                                type="date"
                                sx={{ width: '200px' }}
                                InputLabelProps={{ shrink: true }}
                                label='REC Notification Date'
                                readOnly={this.student_view || this.teacher_view}
                                value={this.state.student_thesis.rec_notification_timestamp ? new Date(Number(this.state.student_thesis.rec_notification_timestamp)).toISOString().split('T')[0] : ''}
                                onChange={(e) => this.updateStudentThesis('rec_notification_timestamp', new Date(e.target.value).getTime())} />
                            </Grid>
                            <Grid item xs={'auto'}>
                              <CustomTextField
                                type="date"
                                sx={{ width: '200px' }}
                                InputLabelProps={{ shrink: true }}
                                label='BOASAR Notification Date'
                                readOnly={this.student_view || this.teacher_view}
                                value={this.state.student_thesis.boasar_notification_timestamp ? new Date(Number(this.state.student_thesis.boasar_notification_timestamp)).toISOString().split('T')[0] : ''}
                                onChange={(e) => this.updateStudentThesis('boasar_notification_timestamp', new Date(e.target.value).getTime())} />
                            </Grid>
                            <Grid item xs={'auto'}>
                              <CustomTextField
                                type="date"
                                sx={{ width: '200px' }}
                                InputLabelProps={{ shrink: true }}
                                label='FE Notification Date'
                                readOnly={this.student_view || this.teacher_view}
                                value={this.state.student_thesis.fe_notification_timestamp ? new Date(Number(this.state.student_thesis.fe_notification_timestamp)).toISOString().split('T')[0] : ''}
                                onChange={(e) => this.updateStudentThesis('fe_notification_timestamp', new Date(e.target.value).getTime())} />
                            </Grid>
                            <Grid item xs={12}>
                              <CustomFilesField
                                readOnly={this.student_view || this.teacher_view}
                                label="Attached Documents"
                                documents={this.state.student_thesis.phase_0_documents}
                                onChange={(e) => this.fileUploadHandler('phase_0_documents', e)}
                                onDelete={(file) => this.fileDeleteHandler('phase_0_documents', file)} />
                            </Grid>
                          </Grid>
                        </CustomCard>
                      </Grid>
                      {/* Phase 1: REC-I (Proposal Defense) */}
                      <Grid item xs={12}>
                        <CustomCard>
                          <Grid container spacing={2} direction='row'>
                            <Grid item xs={12}>
                              <Typography variant='h3'>{'Phase 1: REC-I (Proposal Defense)'}</Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={'20px'}>
                              <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                            </Grid>
                            <Grid item xs={12} marginLeft={'20px'}>
                              <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='phd_research_rec_i' />
                            </Grid>
                            <Grid item xs={'auto'}>
                              <CustomTextField
                                type="date"
                                sx={{ width: '200px' }}
                                InputLabelProps={{ shrink: true }}
                                label='REC-I Meeting Date'
                                readOnly={this.student_view || this.teacher_view}
                                value={this.state.student_thesis.rec_i_meeting_timestamp ? new Date(Number(this.state.student_thesis.rec_i_meeting_timestamp)).toISOString().split('T')[0] : ''}
                                onChange={(e) => this.updateStudentThesis('rec_i_meeting_timestamp', new Date(e.target.value).getTime())} />
                            </Grid>
                            <Grid item xs={12}>
                              <CustomFilesField
                                readOnly={this.student_view || this.teacher_view}
                                label="Attached Documents"
                                documents={this.state.student_thesis.phase_1_documents}
                                onChange={(e) => this.fileUploadHandler('phase_1_documents', e)}
                                onDelete={(file) => this.fileDeleteHandler('phase_1_documents', file)} />
                            </Grid>
                          </Grid>
                        </CustomCard>
                      </Grid>
                      {/* Phase 2: REC-II (Progress Report) */}
                      <Grid item xs={12}>
                        <CustomCard>
                          <Grid container spacing={2} direction='row'>
                            <Grid item xs={12}>
                              <Typography variant='h3'>{'Phase 2: REC-II (Progress Report)'}</Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={'20px'}>
                              <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                            </Grid>
                            <Grid item xs={12} marginLeft={'20px'}>
                              <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='phd_research_rec_ii' />
                            </Grid>
                            <Grid item xs={'auto'}>
                              <CustomTextField
                                type="date"
                                sx={{ width: '200px' }}
                                InputLabelProps={{ shrink: true }}
                                label='REC-II Meeting Date'
                                readOnly={this.student_view || this.teacher_view}
                                value={this.state.student_thesis.rec_ii_meeting_timestamp ? new Date(Number(this.state.student_thesis.rec_ii_meeting_timestamp)).toISOString().split('T')[0] : ''}
                                onChange={(e) => this.updateStudentThesis('rec_ii_meeting_timestamp', new Date(e.target.value).getTime())} />
                            </Grid>
                            <Grid item xs={12}>
                              <CustomFilesField
                                readOnly={this.student_view || this.teacher_view}
                                label="Attached Documents"
                                documents={this.state.student_thesis.phase_2_documents}
                                onChange={(e) => this.fileUploadHandler('phase_2_documents', e)}
                                onDelete={(file) => this.fileDeleteHandler('phase_2_documents', file)} />
                            </Grid>
                          </Grid>
                        </CustomCard>
                      </Grid>
                      {/* Phase 3: REC-III (Progress Report) */}
                      <Grid item xs={12}>
                        <CustomCard>
                          <Grid container spacing={2} direction='row'>
                            <Grid item xs={12}>
                              <Typography variant='h3'>{'Phase 3: REC-III (Progress Report)'}</Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={'20px'}>
                              <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                            </Grid>
                            <Grid item xs={12} marginLeft={'20px'}>
                              <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='phd_research_rec_iii' />
                            </Grid>
                            <Grid item xs={'auto'}>
                              <CustomTextField
                                type="date"
                                sx={{ width: '200px' }}
                                InputLabelProps={{ shrink: true }}
                                label='REC-III Meeting Date'
                                readOnly={this.student_view || this.teacher_view}
                                value={this.state.student_thesis.rec_iii_meeting_timestamp ? new Date(Number(this.state.student_thesis.rec_iii_meeting_timestamp)).toISOString().split('T')[0] : ''}
                                onChange={(e) => this.updateStudentThesis('rec_iii_meeting_timestamp', new Date(e.target.value).getTime())} />
                            </Grid>
                            <Grid item xs={12}>
                              <CustomFilesField
                                readOnly={this.student_view || this.teacher_view}
                                label="Attached Documents"
                                documents={this.state.student_thesis.phase_3_documents}
                                onChange={(e) => this.fileUploadHandler('phase_3_documents', e)}
                                onDelete={(file) => this.fileDeleteHandler('phase_3_documents', file)} />
                            </Grid>
                          </Grid>
                        </CustomCard>
                      </Grid>
                      {/* Phase 4: Pre-Defense */}
                      <Grid item xs={12}>
                        <CustomCard>
                          <Grid container spacing={2} direction='row'>
                            <Grid item xs={12}>
                              <Typography variant='h3'>{'Phase 4: Pre-Defense'}</Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={'20px'}>
                              <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                            </Grid>
                            <Grid item xs={12} marginLeft={'20px'}>
                              <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='phd_research_pre_defense' />
                            </Grid>
                            <Grid item xs={'auto'}>
                              <CustomTextField
                                type="date"
                                sx={{ width: '200px' }}
                                InputLabelProps={{ shrink: true }}
                                label='Thesis Defense Date'
                                readOnly={this.student_view || this.teacher_view}
                                value={this.state.student_thesis.defense_day_timestamp ? new Date(Number(this.state.student_thesis.defense_day_timestamp)).toISOString().split('T')[0] : ''}
                                onChange={(e) => this.updateStudentThesis('defense_day_timestamp', new Date(e.target.value).getTime())} />
                            </Grid>
                            <Grid item xs={12}>
                              <CustomFilesField
                                readOnly={this.student_view || this.teacher_view}
                                label="Attached Documents"
                                documents={this.state.student_thesis.phase_4_documents}
                                onChange={(e) => this.fileUploadHandler('phase_4_documents', e)}
                                onDelete={(file) => this.fileDeleteHandler('phase_4_documents', file)} />
                            </Grid>
                          </Grid>
                        </CustomCard>
                      </Grid>
                      {/* Phase 5: Post-Defense */}
                      <Grid item xs={12}>
                        <CustomCard>
                          <Grid container spacing={2} direction='row'>
                            <Grid item xs={12}>
                              <Typography variant='h3'>{'Phase 5: Post-Defense'}</Typography>
                            </Grid>
                            <Grid item xs={12} marginTop={'20px'}>
                              <Typography variant='h5' fontWeight={'bold'}>Instructions</Typography>
                            </Grid>
                            <Grid item xs={12} marginLeft={'20px'}>
                              <InstructionsField readOnly={this.student_view || this.teacher_view} instruction_id={1} instruction_detail_key='phd_research_post_defense' />
                            </Grid>
                            <Grid item xs={12}>
                              <CustomFilesField
                                readOnly={this.student_view || this.teacher_view}
                                label="Attached Documents"
                                documents={this.state.student_thesis.phase_5_documents}
                                onChange={(e) => this.fileUploadHandler('phase_5_documents', e)}
                                onDelete={(file) => this.fileDeleteHandler('phase_5_documents', file)} />
                            </Grid>
                          </Grid>
                        </CustomCard>
                      </Grid>
                    </React.Fragment>
                    :
                    <></>
            }
            {/* Action Buttons */}
            {this.student_view || this.teacher_view ? <></> :
              <React.Fragment>
                <Grid item xs={12}>
                  <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                    <Alert variant="outlined" severity={this.state.alertSeverity} sx={defaultStyles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                  </Zoom>
                </Grid>
                <Grid item xs={'auto'}>
                  <CustomButton
                    startIcon={this.state.savingChanges ? <CircularProgress size='14px' /> : undefined}
                    disabled={this.state.savingChanges ? true : false}
                    label='Save changes'
                    onClick={() => {
                      this.setState({ savingChanges: true })
                      socket.emit(`studentsThesis/update`, Object.keys(this.state.student_thesis).filter(key => this.updatedKeys.includes(key) || key == 'student_batch_id').reduce((obj, key) => { obj[key] = this.state.student_thesis[key]; return obj; }, {}), res => {
                        this.setState({
                          savingChanges: false,
                          alertMsg: res.code == 200 ? 'Saved changes!' : `${res.status}: ${res.message}`,
                          alertSeverity: res.code == 200 ? 'success' : 'warning'
                        }, this.timeoutAlert)
                        this.updatedKeys = []
                        this.fetchStudentThesis()
                      })
                    }}
                  />
                </Grid>
                <Grid item xs={'auto'}>
                  <CustomButton
                    label='Reset'
                    onClick={() => this.fetchStudentThesis()}
                  />
                </Grid>
              </React.Fragment>
            }
            <MisThesisExaminers
              open={this.state.thesisExaminersOpen}
              examiner_type={this.state.thesisExaminersType}
              onClose={() => this.setState({ thesisExaminersOpen: false, refreshExaminers: true, thesisExaminersType: '' })}
            />
          </Grid>
    );
  }
}

export default withRouter(MisThesisManagement);
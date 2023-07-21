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
import CustomAlert from '../../../components/CustomAlert';
import CustomTable from '../../../components/CustomTable';
import { convertUpper } from '../../../extras/functions';
import ConfirmationModal from '../../../components/ConfirmationModal';

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

class MisThesisExaminers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      examinersArr: [],

      addExaminerShow: false,
      addExaminerName: '',
      addExaminerUniversity: '',
      addExaminerDesignation: '',
      panel: 'create',

      addingExaminer: false,
      fetchingExaminers: false,

      alertMsg: '',
      alertSeverity: 'warning',

      confirmationModalShow: false,
      confirmationModalMessage: "",
      confirmationModalExecute: () => { },
    }

    this.alertTimeout = null
  }

  componentDidMount() {
    this.fetchExaminers()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({ alertMsg: '' })
    }, 3000);
  }
  componentWillUnmount() {
  }

  addExaminer = () => {
    this.setState({ addingExaminer: true })
    socket.emit('studentsThesisExaminers/create', {
      examiner_name: this.state.addExaminerName,
      examiner_university: this.state.addExaminerUniversity,
      examiner_designation: this.state.addExaminerDesignation,
      examiner_type: this.props.examiner_type
    }, (res) => {
      if (res.code == 200) {
        this.clearAddFields()
        this.fetchExaminers()
      }
      this.setState({
        alertMsg: res.code == 200 ? 'Examiner Added' : `${res.status}: ${res.message}`,
        alertSeverity: res.code == 200 ? 'success' : 'warning',
        addingExaminer: false
      })
    })
  }

  deleteExaminer = (examiner_id) => {
    socket.emit('studentsThesisExaminers/delete', {
      examiner_id: examiner_id
    }, (res) => {
      if (res.code == 200) this.fetchExaminers()
      this.setState({
        alertMsg: res.code == 200 ? 'Examiner Deleted' : `${res.status}: ${res.message}`,
        alertSeverity: res.code == 200 ? 'success' : 'warning',
      })
    })
  }

  clearAddFields = () => {
    this.setState({
      addExaminerName: '',
      addExaminerUniversity: '',
      addExaminerDesignation: ''
    })
  }

  createExaminerPanel = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomTextField required label='Examiner Name' value={this.state.addExaminerName} onChange={(e) => this.setState({ addExaminerName: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField label='Department/University' placeholder='CS&IT UET' value={this.state.addExaminerUniversity} onChange={(e) => this.setState({ addExaminerUniversity: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField label='Designation' placeholder='Assistant Professor' value={this.state.addExaminerDesignation} onChange={(e) => this.setState({ addExaminerDesignation: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
        </Grid>
        <Grid item xs={'auto'}>
          <CustomButton
            disabled={this.state.addingExaminer}
            label={this.state.addingExaminer ? <CircularProgress size='20px' /> : 'Add'}
            onClick={this.addExaminer}
          />
        </Grid>
        <Grid item xs={'auto'}>
          <CustomButton
            variant='outlined'
            label={'Manage Examiners'}
            onClick={() => this.setState({ panel: 'manage' })}
          />
        </Grid>
      </Grid>
    )
  }

  fetchExaminers = () => {
    this.setState({ fetchingExaminers: true })
    socket.emit('studentsThesisExaminers/fetch', {}, (res) => {
      if (res.code == 200) {
        this.setState({
          examinersArr: res.data,
          fetchingExaminers: false
        })
      }
    })
  }

  manageExaminersPanel = () => {
    const columns = [
      { id: "examiner_name", label: "Name", format: (value) => value },
      { id: "examiner_university", label: "Dept./University", format: (value) => value },
      { id: "examiner_designation", label: "Designation", format: (value) => value },
    ];
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomTable
            margin="0px"
            columns={columns}
            rows={this.state.examinersArr}
            loadingState={this.state.fetchingExaminers}
            onDeleteClick={(examiner) => {
              this.setState({
                confirmationModalShow: true,
                confirmationModalMessage: "Are you sure you want to remove this examiner?",
                confirmationModalExecute: () => this.deleteExaminer(examiner.examiner_id)
              });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
        </Grid>
        <Grid item xs={'auto'}>
          <CustomButton
            variant='outlined'
            label={'Create Examiner'}
            onClick={() => this.setState({ panel: 'create' })}
          />
        </Grid>
      </Grid>
    )
  }

  render() {
    return (
      <CustomModal containerStyle={{ width: this.state.panel == 'create' ? 400 : 600 }} open={this.props.open} onClose={this.props.onClose}>
        {
          this.state.panel == 'create' ? this.createExaminerPanel() :
            this.state.panel == 'manage' ? this.manageExaminersPanel() :
              <></>
        }
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
      </CustomModal>
    );
  }
}

export default withRouter(MisThesisExaminers);
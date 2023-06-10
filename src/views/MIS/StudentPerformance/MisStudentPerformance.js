/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from "react";
import {
  Grid, Typography,
} from "@mui/material";
import { withRouter } from "../../../withRouter";
import CustomTextField from "../../../components/CustomTextField";
import CustomButton from "../../../components/CustomButton";
import { ArrowBack, ArrowForward, ArrowRight } from "@mui/icons-material";
import { socket } from "../../../websocket/socket";
import CustomAlert from "../../../components/CustomAlert";
import { Navigate } from "react-router";
import MisStudentTranscript from "../Student Dashboard/Transcript/MisStudentTranscript";
import GoBackButton from "../../../components/GoBackButton";
import ContextInfo from "../../../components/ContextInfo";
import CustomCard from "../../../components/CustomCard";

class MisStudentPerformance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      findUser: '',
      student: undefined,
      studentTranscript: undefined,

      alertMsg: '',
      alertSeverity: '',

      callingApi: ''
    };
    this.student_batch = this.props.location?.state?.student_batch
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({ alertMsg: '' })
    }, 3000);
  }

  componentWillUnmount() {
  }

  fetchStudent = () => {
    if (!this.state.findUser) return this.updateAlertMsg('Field cannot be blank')
    this.setState({ callingApi: 'fetchStudent' })
    socket.emit('students/fetch', { reg_no: this.state.findUser }, (res) => {
      this.setState({ callingApi: '' })
      if (res.code == 200 && res.data.length > 0) {
        this.setState({ student: res.data[0] })
      } else {
        this.setState({ callingApi: 'fetchStudent' })
        socket.emit('students/fetch', { cnic: this.state.findUser }, (res) => {
          this.setState({ callingApi: '' })
          if (res.code == 200 && res.data.length > 0) {
            this.setState({ student: res.data[0] })
          } else {
            this.updateAlertMsg('Could not find that student')
          }
        })
      }
    })
  }

  fetchStudenTranscript = () => {
    if (!this.student_batch) return
    socket.emit("forms/studentTranscript", { student_batch_id: this.student_batch?.student_batch_id }, (res) => {
      if (res.code == 200) {
        return this.setState({
          studentTranscript: res.data
        });
      }
    });
  }

  updateAlertMsg = (res, message) => {
    if (typeof res == 'string') return this.setState({ alertMsg: res, alertSeverity: 'warning' })
    if (res.code == 200 && !message) return
    this.setState({
      alertMsg: res.code == 200 ? message : message || `${res.status}: ${res.message}`,
      alertSeverity: res.code == 200 ? 'success' : 'warning'
    })
  }

  panels = {
    findUser: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
          </Grid>
          <Grid item xs={'auto'}>
            <CustomTextField onPressEnter={this.fetchStudent} value={this.state.findUser} onChange={(e) => this.setState({ findUser: e.target.value })} label={`Enter Student's Reg# or CNIC`} variant="outlined" />
          </Grid>
          <Grid item xs={'auto'} display={'flex'} alignItems={'center'}>
            <CustomButton callingApiState={this.state.callingApi == 'fetchStudent'} label={<ArrowForward />} onClick={this.fetchStudent} />
          </Grid>
        </Grid>
      )
    },
    performance: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomButton variant="outlined" label="Back" startIcon={<ArrowBack />} onClick={() => {
              this.student_batch = undefined
              this.forceUpdate()
            }} />
          </Grid>
          <Grid item xs={12}>
            <ContextInfo contextInfo={this.student_batch} />
          </Grid>
          <Grid item xs={12}>
            <MisStudentTranscript student_batch={this.student_batch} />
          </Grid>
        </Grid>
      )
    }
  }

  render() {
    return (
      !this.student_batch ?
        !this.state.student ? this.panels.findUser() :
          <Navigate to='/mis/sportal/batches' state={{ ...this.props.location?.state, redirect: '/mis/studentPerformance', student_id: this.state.student.student_id }} /> :
        this.panels.performance()
    );
  }
}

export default withRouter(MisStudentPerformance);

/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import {Grid, Typography, InputAdornment, InputLabel, FormControl, IconButton, Button, Link, FilledInput, Box, TextField} from '@mui/material';
import {AccountCircle, Password, Visibility, VisibilityOff} from '@mui/icons-material';
import { socket } from '../../../websocket/socket';
import * as Color from "@mui/material/colors";
import CustomCard from '../../../components/CustomCard';
import LoadingIcon from '../../../components/LoadingIcon';
import { user } from '../../../objects/User';
import CustomTextField from '../../../components/CustomTextField';
import CustomModal from '../../../components/CustomModal';
import CustomButton from '../../../components/CustomButton';
import CustomAlert from '../../../components/CustomAlert';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF'
}

const styles = {
  container: {
    backgroundColor: palletes.primary,
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
}

export default class MisProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      callingApi: 'fetchUser',

      userInput: {},

      modalPanel: '',

      alertMsg: '',
      alertSeverity: '',

      resendCodeTimer: 0
    };

    this.alertTimeout = null
  }

  componentDidMount() {
    this.fetchUser()
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('resendcodetimer',this.state.resendCodeTimer)
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({alertMsg: ''})
    }, 3000);
  }

  fetchUser = () => {
    this.setCallingApi('fetchUser')
    if (!user?.user_id) return
    socket.emit('users/fetch',{fetch_user_id: user.user_id},(res) => {
      if (res.code == 200) {
        this.setState({
          userInfo: res.data[0],
        }, () => this.setCallingApi(''))
      }
    })
  }

  setCallingApi = (value) => this.setState({callingApi: value})

  setModalPanel = (value) => this.setState({modalPanel: value})

  setUserInput = (key,value) => this.setState(state => ({userInput: {...state.userInput, [key]: value}}))

  updateAlertMesg = (res,successMessage) => {
    if (res.code == 200 && !successMessage) return
    this.setState({
      alertMsg: res.code == 200 ? successMessage ? successMessage : '' : `${res.status}: ${res.message}`,
      alertSeverity: res.code == 200 ? successMessage ? 'success' : '' : 'warning'
    })
  }

  resendCodeTimer = (timeout) => {
    if (timeout) {
      clearTimeout(this.resendCodeTimerRef)
      this.setState({resendCodeTimer: timeout}, () => this.resendCodeTimer())
    } else {
      this.resendCodeTimerRef = setTimeout(() => {
        this.setState(state => ({resendCodeTimer: state.resendCodeTimer - 1}), () => this.state.resendCodeTimer > 0 ? this.resendCodeTimer() : null)
      }, 1000);
    }
  }

  sendEmailVerificationCode = (callback) => {
    if (!this.state.userInput['new_email']) return this.setState({alertMsg: 'Invalid input', alertSeverity: 'warning'})
    this.setCallingApi('sendEmailVerificationCode')
    socket.emit('users/sendEmailVerificationCode', {user_email: this.state.userInput['new_email']} , (res) => {
      this.setCallingApi('')
      if (res.code == 200 && callback) callback(res)
      this.updateAlertMesg(res)
      this.resendCodeTimer(15)
    })
  }

  updateEmail = (callback) => {
    if (!this.state.userInput['new_email'] && !this.state.userInput['email_verification_code']) return this.setState({alertMsg: 'Invalid input', alertSeverity: 'warning'})
    this.setCallingApi('updateEmail')
    socket.emit('users/updateEmail', {
      user_email: this.state.userInput['new_email'], 
      email_verification_code: this.state.userInput['email_verification_code']
    } , (res) => {
      this.setCallingApi('')
      if (res.code == 200 && callback) callback(res)
      this.updateAlertMesg(res)
    })
  }

  closeModal = () => {
    this.setModalPanel('')
    this.fetchUser()
    this.setUserInput('new_email','')
    this.setUserInput('confirm_new_email','')
    this.setUserInput('email_verification_code','')
  }


  modalPanels = {
    updateEmailPanel1: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Update Email</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Enter New Email' value={this.state.userInput['new_email'] || ''} onChange={(e) => this.setUserInput('new_email',e.target.value)}/>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Confirm New Email' value={this.state.userInput['confirm_new_email'] || ''} onChange={(e) => this.setUserInput('confirm_new_email',e.target.value)}/>
          </Grid>
          <Grid item xs={12}>
            <CustomButton label='Next' callingApiState={this.state.callingApi == 'sendEmailVerificationCode'} onClick={() => {
              if (this.state.userInput['new_email'] != this.state.userInput['confirm_new_email']) return this.setState({alertMsg: 'Emails mismatch', alertSeverity: 'warning'})
              this.sendEmailVerificationCode(() => this.setModalPanel('updateEmailPanel2'))
            }}/>
          </Grid>
        </Grid>
      )
    },
    updateEmailPanel2: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Update Email</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>Enter the verification code sent at the email address {this.state.userInput['new_email']}</Typography>
            <Typography>Make sure to check the spam folder</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Verification code' value={this.state.userInput['email_verification_code'] || ''} onChange={(e) => this.setUserInput('email_verification_code',e.target.value)}/>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={'auto'}>
            <CustomButton label='Submit' callingApiState={this.state.callingApi == 'updateEmail'} onClick={() => this.updateEmail(() => this.setModalPanel('updateEmailPanel3'))}/>
          </Grid>
          <Grid item xs={'auto'}>
            <CustomButton disabled={this.state.resendCodeTimer > 0} label={this.state.resendCodeTimer > 0 ? `Resend Code (${this.state.resendCodeTimer})` : 'Resend Code'} callingApiState={this.state.callingApi == 'sendEmailVerificationCode'} variant='outlined' onClick={() => this.sendEmailVerificationCode((res) => this.updateAlertMesg(res,'Code Sent'))}/>
          </Grid>
        </Grid>
      )
    },
    updateEmailPanel3: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Update Email</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h4'>Your email has been updated to {this.state.userInput['new_email']}!</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomButton label='OK' onClick={() => this.closeModal()}/>
          </Grid>
        </Grid>
      )
    },
  }

  render() {
    return (
      this.state.callingApi == 'fetchUser' ? <LoadingIcon /> :
      <CustomCard>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h2'>My Profile</Typography>
          </Grid>
          <Grid item xs={'auto'}>
            <CustomTextField readOnly variant='filled' label='Name' value={this.state.userInfo.name}/>
          </Grid>
          <Grid item xs={'auto'}>
            <CustomTextField readOnly variant='filled' label='Email' value={this.state.userInfo.user_email || 'Not found'}/>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={'auto'}>
            <CustomButton label='Update Email' onClick={() => this.setModalPanel('updateEmailPanel1')} />
          </Grid>
          <Grid item xs={'auto'}>
            <CustomButton label='Change Password' onClick={() => this.setModalPanel('changePasswordPanel1')} />
          </Grid>
        </Grid>
        <CustomModal open={this.state.modalPanel != ''} onClose={() => this.closeModal()}>
          <Grid item xs={12}>
            <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
          </Grid>
          {this.modalPanels[this.state.modalPanel] ? this.modalPanels[this.state.modalPanel]() : <></>}
        </CustomModal>
      </CustomCard>
    );
  }
}
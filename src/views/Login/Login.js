/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Typography, IconButton, Button, Link, Box, TextField, Alert, Fade, Zoom, Grid, CircularProgress, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { AccountCircle, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import { socket } from '../../websocket/socket';
import { withRouter } from '../../withRouter';
import eventHandler from '../../eventHandler';
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
import { isEmailValid } from '../../extras/functions';
import CustomAlert from '../../components/CustomAlert';

const styles = {
  container: {
    backgroundImage: `url(/LoginPageImage.jpg)`,
    backgroundPosition: 'center', /* Center the image */
    backgroundRepeat: 'no-repeat',/* Do not repeat the image */
    backgroundSize: 'cover',

    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100vw",
    height: "100%",
  },
  loginPanel: {
    background: "rgba(150, 150, 150, 0.45)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(4px)",

    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "450px",
    minHeight: "350px",
    padding: '50px',
  },
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: '',

      showPassword: false,

      userInput: {
        user_type: 'student'
      },
      user_obj: undefined,

      alertMsg: '',
      alertSeverity: "warning",
      
      activePanel: 'loginPanel',
      resendCodeTimer: 0,

    };
  }

  componentDidMount() {
    this.checkLogin()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({alertMsg: ''})
    }, 3000);
  }

  checkLogin = () => {
    this.props.login({}, (res) => {
      if (res.code == 200) {
        // eventHandler.emit('login/auth', res.data)
        this.props.navigate("/mis")
      }
    })
  }

  login = async () => {
    if (!this.state.userInput['username']) return this.setState({alertMsg: 'Enter username', alertSeverity: 'warning'})
    if (!this.state.userInput['password']) return this.setState({alertMsg: 'Enter password', alertSeverity: 'warning'})
    this.setCallingApi('loginAuth')
    this.props.login({ 
      username: this.state.userInput['username'], 
      password: this.state.userInput['password'],
      user_type: this.state.userInput['user_type']
    }, (res) => {
      this.setCallingApi('')
      if (res.code == 200) {
        // eventHandler.emit('login/auth', res.data)
        this.props.navigate("/mis")
      } else {
        this.updateAlertMesg(res)
      }
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

  setCallingApi = (value) => this.setState({callingApi: value})

  setUserInput = (key,value) => this.setState(state => ({userInput: {...state.userInput, [key]: value}}))

  setPanel = (value) => this.setState({activePanel: value})

  updateAlertMesg = (res,successMessage) => {
    if (res.code == 200 && !successMessage) return
    this.setState({
      alertMsg: res.code == 200 ? successMessage ? successMessage : '' : `${res.status}: ${res.message}`,
      alertSeverity: res.code == 200 ? successMessage ? 'success' : '' : 'warning'
    })
  }

  sendEmailVerificationCode = (callback) => {
    if (!this.state.userInput['username']) return this.setState({alertMsg: 'Enter username or email', alertSeverity: 'warning'})
    if (!this.state.userInput['user_type']) return this.setState({alertMsg: 'User type cannot be empty', alertSeverity: 'warning'})
    this.setCallingApi('sendEmailVerificationCode')
    socket.emit('users/sendEmailVerificationCode', {
      user_email: isEmailValid(this.state.userInput['username']) ? this.state.userInput['username'] : undefined, 
      username: isEmailValid(this.state.userInput['username']) ? undefined : this.state.userInput['username'], 
      user_type: this.state.userInput['user_type']
    } , (res) => {
      console.log(res)
      this.setCallingApi('')
      if (res.code == 200 && callback) {
        this.setState({user_obj : res.data}, () => callback(res))
      }
      this.updateAlertMesg(res)
      this.resendCodeTimer(15)
    })
  }

  resetPassword = (callback) => {
    if (!this.state.userInput['new_password'] || !this.state.userInput['confirm_new_password'] || !this.state.userInput['email_verification_code']) return this.setState({alertMsg: 'Fields cannot be empty', alertSeverity: 'warning'})
    this.setCallingApi('resetPassword')
    socket.emit('users/resetPassword', { 
      user_id: this.state.user_obj?.user_id, 
      email_verification_code: this.state.userInput['email_verification_code'], 
      new_password: this.state.userInput['new_password']
    }, res => {
      this.setCallingApi('')
      if (res.code == 200 && callback) callback(res)
      this.updateAlertMesg(res)
    })
  }

  clearFields = () => {
    this.setUserInput('username','')
    this.setUserInput('password','')
    this.setUserInput('new_password','')
    this.setUserInput('confirm_new_password','')
    this.setUserInput('email_verification_code','')
  }

  panels = {
    loginPanel: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h4" color='white'>Login</Typography>
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end', }}>
            <AccountCircle sx={{color: 'white'}} />
          </Grid>
          <Grid item xs={6} sx={{ justifyContent: 'start', alignContent: 'center', }}>
            <CustomTextField
              variant='standard'
              underlineColor='white'
              labelColor='white'
              labelFocusedColor='white'
              underlineFocusedColor='white'
              inputTextColor='white'
              label="Username"
              variant="standard"
              tabIndex={1}
              onPressEnter={this.login}
              value={this.state.userInput['username'] || ''}
              onChange={(e) => this.setUserInput('username',e.target.value)}  />
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-end', }}>
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
            <Password sx={{color: 'white'}}/>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'start', }}>
            <CustomTextField 
              variant='standard' 
              underlineColor='white' 
              labelColor='white' 
              labelFocusedColor='white' 
              underlineFocusedColor='white' 
              inputTextColor='white' 
              label="Password" 
              variant="standard" 
              tabIndex={2}
              onPressEnter={this.login}
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.userInput['password'] || ''}
              onChange={(e) => this.setUserInput('password',e.target.value)}
            />
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-end' }}>
            <IconButton
              onClick={(e) => this.setState({ showPassword: !this.state.showPassword })}
              sx={{color: 'white'}}
            >
              {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Grid>
          {this.state.userInput['username'] == 'admin' || this.state.userInput['username'] == 'pga' ? <></> :
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
              <RadioGroup sx={{ color: 'white' }} row value={this.state.userInput['user_type']} onChange={(e) => this.setUserInput('user_type',e.target.value)}>
                <FormControlLabel value="student" control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />} label="Student" />
                <FormControlLabel value="teacher" control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />} label="Instructor" />
              </RadioGroup>
            </Grid>
          }
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
            <CustomButton onClick={this.login} tabIndex={3} label={this.state.callingApi ? <CircularProgress size='20px' /> : "Login"} disabled={this.state.callingApi == 'loginAuth'} />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
            <Link href="#" sx={{":hover": {color: 'primary.light'}, color: 'white', textDecoration: 'underline'}} onClick={() => this.setState({ activePanel: 'resetPasswordPanel1' })}>Reset Password</Link>
          </Grid>
        </Grid>
      )
    },
    resetPasswordPanel1: () => {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h4" color='white'>Reset Password</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body1" color='white'>Please enter username or email</Typography>
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end', }}>
            <AccountCircle sx={{color: 'white'}}/>
          </Grid>
          <Grid item xs={6} sx={{ justifyContent: 'start', alignContent: 'center', }}>
            <CustomTextField
              variant='standard'
              underlineColor='white'
              labelColor='white'
              labelFocusedColor='white'
              underlineFocusedColor='white'
              inputTextColor='white'
              label="Username or email"
              variant="standard"
              tabIndex={1}
              value={this.state.userInput['username'] || ''}
              onChange={(e) => this.setUserInput('username',e.target.value)} />
          </Grid>
          {this.state.userInput['username'] == 'admin' || this.state.userInput['username'] == 'pga' ? <></> :
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
              <RadioGroup sx={{ color: 'white' }} row value={this.state.userInput['user_type']} onChange={(e) => this.setUserInput('user_type',e.target.value)}>
                <FormControlLabel value="student" control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />} label="Student" />
                <FormControlLabel value="teacher" control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />} label="Instructor" />
              </RadioGroup>
            </Grid>
          }
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
            <CustomButton onClick={() => this.sendEmailVerificationCode(() => this.setPanel('resetPasswordPanel2'))} tabIndex={3} label={this.state.callingApi ? <CircularProgress size='20px' /> : "Next"} disabled={this.state.callingApi == 'sendEmailVerificationCode'} />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
            <Link href="#" sx={{":hover": {color: 'primary.light'}, color: 'white', textDecoration: 'underline'}} onClick={() => this.setState({ activePanel: 'loginPanel' })}>Login</Link>
          </Grid>
        </Grid>
      )
    },
    resetPasswordPanel2: () => {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4' color='white'>Reset Password</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CustomTextField
              variant='standard'
              underlineColor='white'
              labelColor='white'
              labelFocusedColor='white'
              underlineFocusedColor='white'
              inputTextColor='white'
              label="Enter New Password"
              variant="standard"
              tabIndex={1}
              type='password'
              value={this.state.userInput['new_password'] || ''}
              onChange={(e) => this.setUserInput('new_password',e.target.value)} />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CustomTextField
              variant='standard'
              underlineColor='white'
              labelColor='white'
              labelFocusedColor='white'
              underlineFocusedColor='white'
              inputTextColor='white'
              label="Confirm Password"
              variant="standard"
              tabIndex={1}
              type='password'
              value={this.state.userInput['confirm_new_password'] || ''}
              onChange={(e) => this.setUserInput('confirm_new_password',e.target.value)} />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CustomButton label='Reset Password' callingApiState={this.state.callingApi == 'resetPassword'} onClick={() => {
              if (!this.state.userInput['new_password'] || !this.state.userInput['confirm_new_password']) return this.setState({alertMsg: 'Please enter new password', alertSeverity: 'warning'})
              if (this.state.userInput['new_password'] != this.state.userInput['confirm_new_password']) return this.setState({alertMsg: 'Passwords mismatch', alertSeverity: 'warning'})
              this.setPanel('resetPasswordPanel3')
            }}/>
          </Grid>
        </Grid>
      )
    },
    resetPasswordPanel3: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4' color='white'>Reset Password</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color='white'>Enter the verification code sent at the email address {this.state.userInput['new_email']}</Typography>
            <Typography color='white'>Make sure to check the spam folder</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              variant='standard'
              underlineColor='white'
              labelColor='white'
              labelFocusedColor='white'
              underlineFocusedColor='white'
              inputTextColor='white'
              label="Verification code"
              variant="standard"
              tabIndex={1}
              type='password'
              value={this.state.userInput['email_verification_code'] || ''}
              onChange={(e) => this.setUserInput('email_verification_code',e.target.value)} />
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={'auto'}>
            <CustomButton tabIndex={2} label='Submit' callingApiState={this.state.callingApi == 'resetPassword'} onClick={() => this.resetPassword(() => {
              this.clearFields()
              this.setPanel('resetPasswordPanel4')
            })}/>
          </Grid>
          <Grid item xs={'auto'}>
            <CustomButton disabled={this.state.resendCodeTimer > 0} label={this.state.resendCodeTimer > 0 ? `Resend Code (${this.state.resendCodeTimer})` : 'Resend Code'} callingApiState={this.state.callingApi == 'sendEmailVerificationCode'} variant='contained' onClick={() => this.sendEmailVerificationCode((res) => this.updateAlertMesg(res,'Code Sent'))}/>
          </Grid>
        </Grid>
      )
    },
    resetPasswordPanel4: () => {
      return (
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4' color='white'>Reset Password</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4' color='white'>Your password has been reset!</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="#" sx={{":hover": {color: 'primary.light'}, color: 'white', textDecoration: 'underline' }} onClick={() => this.setState({ activePanel: 'loginPanel' })}>Login</Link>
          </Grid>
        </Grid>
      )
    },
  }

  render() {
    return (
      <Grid container style={styles.container}>
        <Grid container style={styles.loginPanel}>
          {this.state.alertMsg ? 
            <Grid item xs={12}>
              <CustomAlert message={this.state.alertMsg} severity={this.state.alertSeverity} />
            </Grid> : <></>
          }
          {this.panels[this.state.activePanel] ? this.panels[this.state.activePanel]() : <></>}
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(Login);
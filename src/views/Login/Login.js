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
//import background from "/LoginPageImage.jpg";

const palletes = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  alertWarning: '#eb8f34',
  alertSuccess: 'green'
}

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
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    width: "450px",
    padding: '50px',
    minHeight: "350px",
  },
  header: {
    flex: 1,
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    color: palletes.primary
  },
  body: {
    flex: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 0,
    margin: 0,
  },
  inputFields: {
    m: 1,

    width: '75%',
  },
  button: {
    width: '75%',
    marginTop: "3%",
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

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callingApi: false,
      showPassword: false,
      usernameText: '',
      passwordText: '',
      newPasswordText: '',
      alertMsg: '',
      alertSeverity: "warning",
      panelToggle: 'login',
      user_type: 'student',
      activePanel: 'loginPanel',
      user_obj: undefined,
      resendCodeTimer: 0,
      userInput: {}
    };
  }

  componentDidMount() {
    // check if user already logged in
    socket.emit('login/auth', {}, res => {
      console.log('login.js res', res)
      if (res.code == 200) {
        console.log('logged in')
        eventHandler.emit('login/auth', res.data)
        this.props.navigate("/mis")
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.alertMsg && !this.state.alertMsg) return
    clearTimeout(this.alertTimeout)
    this.alertTimeout = setTimeout(() => {
      this.setState({alertMsg: ''})
    }, 3000);
  }

  handleOnClickLogin = async () => {
    if (this.state.usernameText == "") {
      return this.setState({
        alertMsg: "Enter username",
        alertSeverity: 'warning'
      }, () => setTimeout(() => this.setState({ alertMsg: '' }), 3000))
    }
    if (this.state.passwordText == "") {
      return this.setState({
        alertMsg: "Enter password",
        alertSeverity: 'warning'
      }, () => setTimeout(() => this.setState({ alertMsg: '' }), 3000))
    }
    //console.log(this.state.usernameText, this.state.passwordText)
    this.setState({ callingApi: true })
    socket.emit('login/auth', { username: this.state.usernameText, password: this.state.passwordText, user_type: this.state.user_type }, res => {
      this.setState({ callingApi: false })
      if (res.code == 200) {
        console.log('logged in')
        eventHandler.emit('login/auth', res.data)
        this.props.navigate("/mis")
      } else {
        this.setState({
          alertMsg: res.message,
          alertSeverity: 'warning'
        }, () => setTimeout(() => this.setState({ alertMsg: '' }), 3000))
      }
    })
  }

  handleOnClickReset = async () => {
    if (this.state.usernameText == "") {
      return this.setState({
        alertMsg: "Enter username",
        alertSeverity: 'warning'
      }, () => setTimeout(() => this.setState({ alertMsg: '' }), 3000))
    }
    if (this.state.passwordText == "" || this.state.newPasswordText == "") {
      return this.setState({
        alertMsg: "Enter password",
        alertSeverity: 'warning'
      }, () => setTimeout(() => this.setState({ alertMsg: '' }), 3000))
    }
    //console.log(this.state.usernameText, this.state.passwordText)
    this.setState({ callingApi: true })
    socket.emit('login/resetPassword', { username: this.state.usernameText, old_password: this.state.passwordText, new_password: this.state.newPasswordText }, res => {
      this.setState({ callingApi: false })
      if (res.code == 200) {
        console.log('passwordReset')
        this.setState({ panelToggle: 'login', alertMsg: 'Password has been reset', alertSeverity: 'success' })
      } else {
        this.setState({
          alertMsg: res.message
        }, () => setTimeout(() => this.setState({ alertMsg: '' }), 3000))
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
    if (!this.state.usernameText) return this.setState({alertMsg: 'Enter username or email', alertSeverity: 'warning'})
    if (!this.state.user_type) return this.setState({alertMsg: 'User type cannot be empty', alertSeverity: 'warning'})
    this.setCallingApi('sendEmailVerificationCode')
    socket.emit('users/sendEmailVerificationCode', {
      user_email: isEmailValid(this.state.usernameText) ? this.state.usernameText : undefined, 
      username: isEmailValid(this.state.usernameText) ? undefined : this.state.usernameText, 
      user_type: this.state.user_type
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
    this.setUserInput('new_email','')
    this.setUserInput('confirm_new_email','')
    this.setUserInput('email_verification_code','')
    this.setUserInput('current_password','')
    this.setUserInput('new_password','')
    this.setUserInput('confirm_new_password','')
  }

  panels = {
    loginPanel: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography style={{ color: palletes.primary }} variant="h4">Login</Typography>
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end', }}>
            <AccountCircle sx={{ color: palletes.primary }} />
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
              onPressEnter={this.handleOnClickLogin}
              onChange={(e) => this.setState({ usernameText: e.target.value })} />
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-end', }}>
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
            <Password sx={{ color: palletes.primary, }} />
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'start', }}>
            <CustomTextField variant='standard' underlineColor='white' labelColor='white' labelFocusedColor='white' underlineFocusedColor='white' inputTextColor='white' label="Password" variant="standard" tabIndex={2}
              onPressEnter={this.handleOnClickLogin}
              onChange={(e) => this.setState({ passwordText: e.target.value })}
              type={this.state.showPassword ? 'text' : 'password'}
            />
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-end' }}>
            <IconButton
              onClick={(e) => this.setState({ showPassword: !this.state.showPassword })}
            >
              {this.state.showPassword ? <VisibilityOff sx={{ color: palletes.primary }} /> : <Visibility sx={{ color: palletes.primary }} />}
            </IconButton>
          </Grid>
          {this.state.usernameText == 'admin' || this.state.usernameText == 'pga' ? <></> :
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
              <RadioGroup sx={{ color: 'white' }} row value={this.state.user_type} onChange={(e) => this.setState({ user_type: e.target.value })}>
                <FormControlLabel value="student" control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />} label="Student" />
                <FormControlLabel value="teacher" control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />} label="Intructor" />
              </RadioGroup>
            </Grid>
          }
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
            <CustomButton style={{ width: '75%', marginTop: '20px' }} onClick={this.handleOnClickLogin} tabIndex={3} label={this.state.callingApi ? <CircularProgress size='20px' /> : "Login"} disabled={this.state.callingApi} />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
            <Link href="#" style={{ marginTop: '3%', color: palletes.primary, textDecorationColor: 'white' }} onClick={() => this.setState({ activePanel: 'resetPasswordPanel1' })}>Reset Password</Link>
          </Grid>
        </Grid>
      )
    },
    resetPasswordPanel1: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography style={{ color: palletes.primary }} variant="h4">Reset Password</Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography style={{ color: palletes.primary }} variant="body1">Please enter username or email</Typography>
          </Grid>
          <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end', }}>
            <AccountCircle sx={{ color: palletes.primary }} />
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
              onPressEnter={this.handleOnClickLogin}
              onChange={(e) => this.setState({ usernameText: e.target.value })} />
          </Grid>
          {this.state.usernameText == 'admin' || this.state.usernameText == 'pga' ? <></> :
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
              <RadioGroup sx={{ color: 'white' }} row value={this.state.user_type} onChange={(e) => this.setState({ user_type: e.target.value })}>
                <FormControlLabel value="student" control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />} label="Student" />
                <FormControlLabel value="teacher" control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />} label="Intructor" />
              </RadioGroup>
            </Grid>
          }
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
            <CustomButton style={{ width: '75%', marginTop: '20px' }} onClick={() => this.sendEmailVerificationCode(() => this.setPanel('resetPasswordPanel2'))} tabIndex={3} label={this.state.callingApi ? <CircularProgress size='20px' /> : "Next"} disabled={this.state.callingApi == 'sendEmailVerificationCode'} />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
            <Link href="#" style={{ marginTop: '3%', color: palletes.primary, textDecorationColor: 'white' }} onClick={() => this.setState({ activePanel: 'loginPanel' })}>Login</Link>
          </Grid>
        </Grid>
      )
    },
    resetPasswordPanel2: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Reset Password</Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Enter New Password' type='password' value={this.state.userInput['new_password'] || ''} onChange={(e) => this.setUserInput('new_password',e.target.value)}/>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField label='Confirm New Password' type='password' value={this.state.userInput['confirm_new_password'] || ''} onChange={(e) => this.setUserInput('confirm_new_password',e.target.value)}/>
          </Grid>
          <Grid item xs={12}>
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
            <Typography variant='h4'>Reset Password</Typography>
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
            <CustomButton label='Submit' callingApiState={this.state.callingApi == 'resetPassword'} onClick={() => this.resetPassword(() => this.setPanel('resetPasswordPanel4'))}/>
          </Grid>
          <Grid item xs={'auto'}>
            <CustomButton disabled={this.state.resendCodeTimer > 0} label={this.state.resendCodeTimer > 0 ? `Resend Code (${this.state.resendCodeTimer})` : 'Resend Code'} callingApiState={this.state.callingApi == 'sendEmailVerificationCode'} variant='outlined' onClick={() => this.sendEmailVerificationCode((res) => this.updateAlertMesg(res,'Code Sent'))}/>
          </Grid>
        </Grid>
      )
    },
    resetPasswordPanel4: () => {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h4'>Reset Password</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h4'>Your password has been reset!</Typography>
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
      <Grid container style={styles.container}>
        <Grid container style={styles.loginPanel}>
          <Grid item xs={12}>
            <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
              <Alert variant="outlined" severity={this.state.alertSeverity} sx={styles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
            </Zoom>
          </Grid>
          {this.panels[this.state.activePanel] ? this.panels[this.state.activePanel]() : <></>}
          {/* <div style={styles.header}>
            <Fade in={this.state.panelToggle == 'login' ? true : false} timeout={this.state.panelToggle == 'login' ? 500 : 0} mountOnEnter unmountOnExit>
            </Fade>
            <Fade in={this.state.panelToggle == 'reset' ? true : false} timeout={this.state.panelToggle == 'reset' ? 500 : 0} mountOnEnter unmountOnExit>
            </Fade>
          </div>
          <div>
            <Fade in={this.state.panelToggle == 'login' ? true : false} timeout={this.state.panelToggle == 'login' ? 500 : 0} mountOnEnter unmountOnExit>
              <Grid container columnSpacing={'10px'} rowSpacing={'20px'}>
              </Grid>
            </Fade>
            <Fade in={this.state.panelToggle == 'reset' ? true : false} timeout={this.state.panelToggle == 'reset' ? 500 : 0} mountOnEnter unmountOnExit>
              <Grid container columnSpacing={'10px'} rowSpacing={'20px'}>
                <Grid item xs={12}>
                  <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                    <Alert variant="outlined" severity={this.state.alertSeverity} sx={styles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                  </Zoom>
                </Grid>

                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end', }}>
                  <AccountCircle sx={{ color: palletes.primary, mr: 1, my: 0.5, }} />
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-end', }}>
                  <CustomTextField variant='standard' underlineColor='white' labelColor='white' labelFocusedColor='white' underlineFocusedColor='white' inputTextColor='white' label="Username" inputProps={{ tabIndex: "1" }} tabIndex={1}

                    onChange={(e) => this.setState({ usernameText: e.target.value })}
                  />
                </Grid>
                <Grid item xs={3}></Grid>

                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end', }}>
                  <Password sx={{ color: palletes.primary, mr: 1, my: 0.5, }} />
                </Grid >
                <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-end', }}>
                  <CustomTextField variant='standard' underlineColor='white' labelColor='white' labelFocusedColor='white' underlineFocusedColor='white' inputTextColor='white' label="Old Password" tabIndex={2}

                    onChange={(e) => this.setState({ passwordText: e.target.value })}
                    type={this.state.showPassword ? 'text' : 'password'}
                  />
                </Grid>
                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-end', }}>
                  <IconButton
                    onClick={(e) => this.setState({ showPassword: !this.state.showPassword })}
                  >
                    {this.state.showPassword ? <VisibilityOff sx={{ color: palletes.primary }} /> : <Visibility sx={{ color: palletes.primary }} />}
                  </IconButton>
                </Grid>
                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end', }}>
                  <Password sx={{ color: palletes.primary, mr: 1, my: 0.5, }} />
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', }}>
                  <CustomTextField variant='standard' underlineColor='white' labelColor='white' labelFocusedColor='white' underlineFocusedColor='white' inputTextColor='white' label="New Password" tabIndex={3}

                    onChange={(e) => this.setState({ newPasswordText: e.target.value })}
                    type={this.state.showPassword ? 'text' : 'password'}
                  />
                </Grid>
                <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'flex-end', }}>
                  <IconButton
                    onClick={(e) => this.setState({ showPassword: !this.state.showPassword })}
                  >
                    {this.state.showPassword ? <VisibilityOff sx={{ color: palletes.primary }} /> : <Visibility sx={{ color: palletes.primary }} />}
                  </IconButton>

                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                  <CustomButton style={{ width: '75%', marginTop: '20px' }} onClick={this.handleOnClickReset} tabIndex={4} label={this.state.callingApi ? <CircularProgress size='20px' /> : "Reset"} disabled={this.state.callingApi} />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                  <Link href="#" style={{ marginTop: '3%', color: palletes.primary, textDecorationColor: 'white' }} onClick={() => this.setState({ panelToggle: 'login' })}>Login</Link>
                </Grid>








              </Grid>
            </Fade>
          </div> */}
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(Login);
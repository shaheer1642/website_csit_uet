
import React from 'react';
import {Typography, IconButton, Button, Link, Box, TextField, Alert, Fade, Zoom} from '@mui/material';
import {AccountCircle, Password, Visibility, VisibilityOff} from '@mui/icons-material';
import { socket } from '../../websocket/socket';
import { withRouter } from '../../withRouter';
import eventHandler from '../../eventHandler';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF',
  alertWarning: '#eb8f34',
  alertSuccess: 'green'
}

const styles = {
  container: {
    backgroundColor:palletes.primary,
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    width: "100vw",
    height: "100%",
  },
  loginPanel: {
    background: "rgba(255, 255, 255, 0.01)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center', 
    width: "450px",
    height: "75%",
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
      width:'100%', 
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
      width:'100%', 
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
      showPassword: false,
      usernameText: '',
      passwordText: '',
      newPasswordText: '',
      alertMsg: '',
      alertSeverity: "warning",
      panelToggle: 'login'
    };
  }

  handleOnClickLogin = async () => {
    if (this.state.usernameText == "") {
      return this.setState({
        alertMsg: "Enter username",
        alertSeverity: 'warning'
      }, () => setTimeout(() => this.setState({alertMsg: ''}), 3000))
    }
    if (this.state.passwordText == "") {
      return this.setState({
        alertMsg: "Enter password",
        alertSeverity: 'warning'
      }, () => setTimeout(() => this.setState({alertMsg: ''}), 3000))
    }
    //console.log(this.state.usernameText, this.state.passwordText)
    socket.emit('login/auth',{username: this.state.usernameText, password: this.state.passwordText}, res => {
      if (res.code == 200) {
        console.log('logged in')
        eventHandler.emit('login/auth', res.data)
        this.props.navigate("/mis")
      } else {
        this.setState({
          alertMsg: res.message,
          alertSeverity: 'warning'
        }, () => setTimeout(() => this.setState({alertMsg: ''}), 3000))
      }
    })
  }

  handleOnClickReset = async () => {
    if (this.state.usernameText == "") {
      return this.setState({
        alertMsg: "Enter username",
        alertSeverity: 'warning'
      }, () => setTimeout(() => this.setState({alertMsg: ''}), 3000))
    }
    if (this.state.passwordText == "" || this.state.newPasswordText == "") {
      return this.setState({
        alertMsg: "Enter password",
        alertSeverity: 'warning'
      }, () => setTimeout(() => this.setState({alertMsg: ''}), 3000))
    }
    //console.log(this.state.usernameText, this.state.passwordText)
    socket.emit('login/resetPassword',{username: this.state.usernameText, old_password: this.state.passwordText, new_password: this.state.newPasswordText}, res => {
      if (res.code == 200) {
        console.log('passwordReset')
        this.setState({panelToggle: 'login', alertMsg: 'Password has been reset', alertSeverity: 'success'})
      } else {
        this.setState({
          alertMsg: res.message
        }, () => setTimeout(() => this.setState({alertMsg: ''}), 3000))
      }
    })
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.loginPanel}>
          <div style={styles.header}>
              <Fade direction={'up'} in={this.state.panelToggle == 'login' ? true:false}  timeout={this.state.panelToggle == 'login' ? 500 : 0} mountOnEnter unmountOnExit>
                <Typography style={{color: palletes.primary}} variant="h4">
                  Login
                </Typography>
              </Fade>
              <Fade direction={'up'} in={this.state.panelToggle == 'reset' ? true:false}  timeout={this.state.panelToggle == 'reset' ? 500 : 0} mountOnEnter unmountOnExit>
                <Typography style={{color: palletes.primary}} variant="h4">
                  Reset Password
                </Typography>
              </Fade>
          </div>
          <div style={styles.body}>
              <Fade direction={'up'} in={this.state.panelToggle == 'login' ? true:false}  timeout={this.state.panelToggle == 'login' ? 500 : 0} mountOnEnter unmountOnExit>
                <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
                    <Zoom in={this.state.alertMsg == '' ? false:true} unmountOnExit mountOnEnter>
                      <Alert variant= "outlined" severity={this.state.alertSeverity} sx={styles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                    </Zoom>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <AccountCircle sx={{ color: palletes.primary, mr: 1, my: 0.5,  }} />
                      <TextField color='textField1' label="Username" variant="standard" inputProps={{ tabIndex: "1" }}
                        sx= {{...styles.inputFields, width: '85%'}}
                        onChange={(e) => this.setState({usernameText: e.target.value})}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Password sx={{ color: palletes.primary, mr: 1, my: 0.5,  }} />
                      <TextField color='textField1' label="Password" variant="standard" inputProps={{ tabIndex: "2" }}
                        sx= {styles.inputFields}
                        onChange={(e) => this.setState({passwordText: e.target.value})}
                        type= {this.state.showPassword ? 'text':'password'}
                        />
                      <IconButton
                        onClick={(e) => this.setState({showPassword: !this.state.showPassword})}
                      >
                      {this.state.showPassword ? <VisibilityOff sx={{color: palletes.primary}}/> : <Visibility sx={{color: palletes.primary}} />}
                      </IconButton>
                    </Box>
                  </Box>
                  <Button variant="contained" color="button1" sx={styles.button} onClick={this.handleOnClickLogin} tabIndex={3}>Login</Button>
                  <Link href="#" style={{marginTop: '3%'}} onClick={() => this.setState({panelToggle: 'reset'})}>Reset Password</Link>
                </Box>
              </Fade>
              <Fade direction={'up'} in={this.state.panelToggle == 'reset' ? true:false}  timeout={this.state.panelToggle == 'reset' ? 500 : 0} mountOnEnter unmountOnExit>
                <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
                    <Zoom in={this.state.alertMsg == '' ? false:true} unmountOnExit mountOnEnter>
                      <Alert variant= "outlined" severity={this.state.alertSeverity} sx={styles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                    </Zoom>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <AccountCircle sx={{ color: palletes.primary, mr: 1, my: 0.5,  }} />
                      <TextField color='textField1' label="Username" variant="standard" inputProps={{ tabIndex: "1" }}
                        sx= {{...styles.inputFields, width: '85%'}}
                        onChange={(e) => this.setState({usernameText: e.target.value})}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Password sx={{ color: palletes.primary, mr: 1, my: 0.5,  }} />
                      <TextField color='textField1' label="Old Password" variant="standard" inputProps={{ tabIndex: "2" }}
                        sx= {styles.inputFields}
                        onChange={(e) => this.setState({passwordText: e.target.value})}
                        type= {this.state.showPassword ? 'text':'password'}
                        />
                      <IconButton
                        onClick={(e) => this.setState({showPassword: !this.state.showPassword})}
                      >
                      {this.state.showPassword ? <VisibilityOff sx={{color: palletes.primary}}/> : <Visibility sx={{color: palletes.primary}} />}
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Password sx={{ color: palletes.primary, mr: 1, my: 0.5,  }} />
                      <TextField color='textField1' label="New Password" variant="standard" inputProps={{ tabIndex: "3" }}
                        sx= {styles.inputFields}
                        onChange={(e) => this.setState({newPasswordText: e.target.value})}
                        type= {this.state.showPassword ? 'text':'password'}
                        />
                      <IconButton  
                        onClick={(e) => this.setState({showPassword: !this.state.showPassword})}
                      >
                      {this.state.showPassword ? <VisibilityOff sx={{color: palletes.primary}}/> : <Visibility sx={{color: palletes.primary}} />}
                      </IconButton>
                    </Box>
                  </Box>
                  <Button variant="contained" color="button1" sx={styles.button} onClick={this.handleOnClickReset} tabIndex={4}>Reset</Button>
                  <Link href="#" style={{marginTop: '3%'}} onClick={() => this.setState({panelToggle: 'login'})}>Login</Link>
                </Box>
              </Fade>
          </div>
        </div>
      </div>
      );
  }
}

export default withRouter(Login);
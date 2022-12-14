/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import { Typography, IconButton, Button, Link, Box, TextField, Alert, Fade, Zoom, Grid } from '@mui/material';
import { AccountCircle, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import { socket } from '../../websocket/socket';
import { withRouter } from '../../withRouter';
import eventHandler from '../../eventHandler';
import CustomButton from '../../components/CustomButton';
import CustomTextField from '../../components/CustomTextField';
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
      showPassword: false,
      usernameText: '',
      passwordText: '',
      newPasswordText: '',
      alertMsg: '',
      alertSeverity: "warning",
      panelToggle: 'login'
    };
  }

  componentDidMount() {
    // check if user already logged in
    socket.emit('login/auth', {}, res => {
      if (res.code == 200) {
        console.log('logged in')
        eventHandler.emit('login/auth', res.data)
        this.props.navigate("/mis")
      }
    })
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
    socket.emit('login/auth', { username: this.state.usernameText, password: this.state.passwordText }, res => {
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
    socket.emit('login/resetPassword', { username: this.state.usernameText, old_password: this.state.passwordText, new_password: this.state.newPasswordText }, res => {
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

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.loginPanel}>
          <div style={styles.header}>
            <Fade direction={'up'} in={this.state.panelToggle == 'login' ? true : false} timeout={this.state.panelToggle == 'login' ? 500 : 0} mountOnEnter unmountOnExit>
              <Typography style={{ color: palletes.primary }} variant="h4">
                Login
              </Typography>
            </Fade>
            <Fade direction={'up'} in={this.state.panelToggle == 'reset' ? true : false} timeout={this.state.panelToggle == 'reset' ? 500 : 0} mountOnEnter unmountOnExit>
              <Typography style={{ color: palletes.primary }} variant="h4">
                Reset Password
              </Typography>
            </Fade>
          </div>
          <div s>
            <Fade direction={'up'} in={this.state.panelToggle == 'login' ? true : false} timeout={this.state.panelToggle == 'login' ? 500 : 0} mountOnEnter unmountOnExit>
              <Grid container columnSpacing={'10px'} rowSpacing={'20px'}>
                <Grid item xs={12}>
                  <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                    <Alert variant="outlined" severity={this.state.alertSeverity} sx={styles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                  </Zoom>
                </Grid>
                  <Grid item xs={3} sx={{display: 'flex',justifyContent:'end', alignItems:'flex-end',}}>
                    
                   <AccountCircle sx={{ color: palletes.primary}} />
                  </Grid>
                  <Grid item xs={6} sx={{justifyContent:'start', alignContent:'center',}}>
              
                   <CustomTextField underlineColor='white' labelColor='white' labelFocusedColor='white' underlineFocusedColor='white' inputTextColor='white' label="Username" variant="standard" tabIndex={1}
                      onPressEnter={this.handleOnClickLogin}
                      onChange={(e) => this.setState({ usernameText: e.target.value })} /> 
                  </Grid>
                  <Grid item xs={3} sx={{display: 'flex',justifyContent:'start', alignItems:'flex-end',}}>
                    
                    
                  </Grid>
                
              
                  <Grid item xs={3} sx={{display: 'flex',justifyContent:'end', alignItems:'flex-end', }}>
                    <Password sx={{ color: palletes.primary, }} />
                  </Grid>
                  <Grid item xs={6} sx={{display: 'flex',justifyContent:'start', }}>
                    <CustomTextField underlineColor='white' labelColor='white' labelFocusedColor='white' underlineFocusedColor='white' inputTextColor='white' label="Password" variant="standard" tabIndex={2}
                      onPressEnter={this.handleOnClickLogin}
                      onChange={(e) => this.setState({ passwordText: e.target.value })}
                      type={this.state.showPassword ? 'text' : 'password'}
                    />
                  </Grid>

                  <Grid item xs={3} sx={{display: 'flex',justifyContent:'start', alignItems:'flex-end',}}>
                    <IconButton
                      onClick={(e) => this.setState({ showPassword: !this.state.showPassword })}
                    >
                      {this.state.showPassword ? <VisibilityOff sx={{ color: palletes.primary }} /> : <Visibility sx={{ color: palletes.primary }} />}
                    </IconButton>
                  </Grid>
             
              
              <Grid item xs={12} sx={{display: 'flex',justifyContent:'center', }}>
                <CustomButton style={{ width: '75%', marginTop: '20px' }} onClick={this.handleOnClickLogin} tabIndex={3} label="Login" />
              </Grid>
              <Grid item xs={12} sx={{display: 'flex',justifyContent:'center', }}>
                <Link href="#" style={{ marginTop: '3%', color: palletes.primary, textDecorationColor: 'white' }} onClick={() => this.setState({ panelToggle: 'reset' })}>Reset Password</Link>
              </Grid>
            </Grid>
          </Fade>
          <Fade direction={'up'} in={this.state.panelToggle == 'reset' ? true : false} timeout={this.state.panelToggle == 'reset' ? 500 : 0} mountOnEnter unmountOnExit>
            <Grid container columnSpacing={'10px'} rowSpacing={'20px'}>
               <Grid item xs={12}>
               <Zoom in={this.state.alertMsg == '' ? false : true} unmountOnExit mountOnEnter>
                  <Alert variant="outlined" severity={this.state.alertSeverity} sx={styles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
                </Zoom>
               </Grid>
               
                  <Grid item xs={3} sx={{display: 'flex',justifyContent:'end', alignItems:'flex-end',}}>
                  <AccountCircle sx={{ color: palletes.primary, mr: 1, my: 0.5, }} />
                  </Grid>
                  <Grid item xs={6} sx={{display: 'flex',justifyContent:'start', alignItems:'flex-end',}}>
                  <CustomTextField underlineColor='white' labelColor='white' labelFocusedColor='white' underlineFocusedColor='white' inputTextColor='white' label="Username" inputProps={{ tabIndex: "1" }} tabIndex={1}
            
                    onChange={(e) => this.setState({ usernameText: e.target.value })}
                  />
                  </Grid>
                 <Grid item xs={3}></Grid>
               
             <Grid item xs={3}  sx={{display: 'flex',justifyContent:'end', alignItems:'flex-end',}}>
             <Password sx={{ color: palletes.primary, mr: 1, my: 0.5, }} />
             </Grid >
             <Grid item xs={6}  sx={{display: 'flex',justifyContent:'start', alignItems:'flex-end',}}>
             <CustomTextField underlineColor='white' labelColor='white' labelFocusedColor='white' underlineFocusedColor='white' inputTextColor='white' label="Old Password" tabIndex={2}
                   
                    onChange={(e) => this.setState({ passwordText: e.target.value })}
                    type={this.state.showPassword ? 'text' : 'password'}
                  />
             </Grid>
             <Grid item xs={3} sx={{display: 'flex',justifyContent:'start', alignItems:'flex-end',}}>
             <IconButton
                    onClick={(e) => this.setState({ showPassword: !this.state.showPassword })}
                  >
                    {this.state.showPassword ? <VisibilityOff sx={{ color: palletes.primary }} /> : <Visibility sx={{ color: palletes.primary }} />}
                  </IconButton>
             </Grid>
            <Grid item xs={3} sx={{display: 'flex',justifyContent:'end', alignItems:'flex-end',}}>
            <Password sx={{ color: palletes.primary, mr: 1, my: 0.5, }} />
            </Grid>
            <Grid item xs={6} sx={{display: 'flex',justifyContent:'center', alignItems:'flex-end',}}>
            <CustomTextField underlineColor='white' labelColor='white' labelFocusedColor='white' underlineFocusedColor='white' inputTextColor='white' label="New Password" tabIndex={3}
               
                    onChange={(e) => this.setState({ newPasswordText: e.target.value })}
                    type={this.state.showPassword ? 'text' : 'password'}
                  />
            </Grid>
            <Grid item xs={3}  sx={{display: 'flex',justifyContent:'start', alignItems:'flex-end',}}>
            <IconButton
                    onClick={(e) => this.setState({ showPassword: !this.state.showPassword })}
                  >
                    {this.state.showPassword ? <VisibilityOff sx={{ color: palletes.primary }} /> : <Visibility sx={{ color: palletes.primary }} />}
                  </IconButton>
          
            </Grid>
            <Grid item xs={12} sx={{display: 'flex',justifyContent:'center', }}>
            <CustomButton style={{ width: '75%', marginTop: '20px' }} onClick={this.handleOnClickReset} tabIndex={4} label="Reset" />
            </Grid>
            <Grid item xs={12} sx={{display: 'flex',justifyContent:'center', }}>
            <Link href="#" style={{ marginTop: '3%', color: palletes.primary, textDecorationColor: 'white' }} onClick={() => this.setState({ panelToggle: 'login' })}>Login</Link>
            </Grid>
                
             
            
                  
               
              
            
    
            </Grid>
          </Fade>
        </div>
      </div>
      </div >
    );
  }
}

export default withRouter(Login);
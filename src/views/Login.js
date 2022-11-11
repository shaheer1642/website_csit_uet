// eslint-disable-no-unused-vars
import '../App.css';
import React from 'react';
import {Grid, Typography, InputAdornment, InputLabel, FormControl, IconButton, Button, Link, FilledInput, Box, TextField, Alert} from '@mui/material';
import {AccountCircle, Password, Visibility, VisibilityOff} from '@mui/icons-material';
import { socket, socketHasConnected } from '../websocket/socket';
import { withRouter } from '../withRouter';
import eventHandler from '../eventHandler';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF',
  tertiary: '#eb8f34'
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
    width: "400px",
    height: "70%",
    minHeight: "350px",
  },
  header: {
    flex: 1,
    marginTop: 20
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
    '& label.Mui-focused': {
      color: palletes.secondary,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: palletes.secondary,
    },
  },
  button: {
    width: '75%',
    marginTop: "3%",
    backgroundColor: palletes.primary
  },
  alertBox: {
    width:'100%', 
    borderRadius: 0, 
    color: palletes.tertiary, // text color
    borderColor: palletes.tertiary, 
    py: "5px", 
    px: "10px",
    '& .MuiAlert-icon': {
      color: palletes.tertiary, // icon color
    },
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      usernameText: '',
      passwordText: '',
      alertMsg: '',
    };
  }

  handleOnClickLogin = async () => {
    await socketHasConnected()
    if (this.state.usernameText == "") {
      return this.setState({
        alertMsg: "Enter username"
      }, () => setTimeout(() => this.setState({alertMsg: ''}), 3000))
    }
    if (this.state.passwordText == "") {
      return this.setState({
        alertMsg: "Enter password"
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
              <Typography style={{color: palletes.primary}} variant="h4">
                Login
              </Typography>
          </div>
          <div style={styles.body}>
            <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
              {this.state.alertMsg == ''? <></>:<Alert variant= "outlined" severity="warning" sx={styles.alertBox}>{this.state.alertMsg}</Alert>}
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <AccountCircle sx={{ color: palletes.primary, mr: 1, my: 0.5,  }} />
                <TextField label="Username" variant="standard" 
                  sx= {{...styles.inputFields, width: '85%'}}
                  onChange={(e) => this.setState({usernameText: e.target.value})}
                  />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Password sx={{ color: palletes.primary, mr: 1, my: 0.5,  }} />
                <TextField label="Password" variant="standard" 
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
            <Button variant="contained" sx={styles.button} onClick={this.handleOnClickLogin}>Login</Button>
            <Link href='/' style={{marginTop: '3%'}}>Reset Password</Link>
          </div>
        </div>
      </div>
      );
  }
}

export default withRouter(Login);
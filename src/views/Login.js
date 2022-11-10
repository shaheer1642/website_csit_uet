// eslint-disable-no-unused-vars
import '../App.css';
import React from 'react';
import {Grid, Typography, InputAdornment, InputLabel, FormControl, IconButton, Button, Link, FilledInput, Box, TextField} from '@mui/material';
import {AccountCircle, Password, Visibility, VisibilityOff} from '@mui/icons-material';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF'
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
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      usernameText: '',
      passwordText: ''
    };
  }

  handleOnClickLogin = () => {
    console.log(this.state.usernameText, this.state.passwordText)
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
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <AccountCircle sx={{ color: palletes.primary, mr: 1, my: 0.5,  }} />
                <TextField label="Username" variant="standard" 
                  sx= {styles.inputFields}
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
            <Link href='/' style={{marginTop: '3%'}}>Forgot Password?</Link>
          </div>
        </div>
      </div>
      );
  }
}

export default Login;
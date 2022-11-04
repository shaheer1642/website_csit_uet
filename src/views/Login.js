import '../App.css';
import React from 'react';
import {Grid, Typography} from '@mui/material';

class Login extends React.Component {


  render() {
    return (
      <Grid container style={{margin: 20}}>
        <Typography style={{textAlign: 'left'}} variant="h4">
          This is the login page
        </Typography>
      </Grid>
      );
  }
}

export default Login;

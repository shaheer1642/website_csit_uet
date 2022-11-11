// eslint-disable-no-unused-vars
import React from 'react';
import {Grid, Typography, InputAdornment, InputLabel, FormControl, IconButton, Button, Link, FilledInput, Box, TextField} from '@mui/material';
import {AccountCircle, Password, Visibility, VisibilityOff} from '@mui/icons-material';
import { socket } from '../../websocket/socket';

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
    width: "100%",
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

export default class MisEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <Typography style={{color: palletes.primary}} variant="h4">
          MIS Events
        </Typography>
      </div>
      );
  }
}
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

export default class MisHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <Typography style={{color: palletes.primary}} variant="h4">
          MIS Dashboard
        </Typography>
      </div>
      );
  }
}
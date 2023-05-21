/* eslint eqeqeq: "off", no-unused-vars: "off" */
import React from 'react';
import {Grid, Typography, InputAdornment, InputLabel, FormControl, IconButton, Button, Link, FilledInput, Box, TextField} from '@mui/material';
import {AccountCircle, Password, Visibility, VisibilityOff} from '@mui/icons-material';
import { socket } from '../../../websocket/socket';
import * as Color from "@mui/material/colors";

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
      <div >
        <Typography style={{color: Color.deepPurple[500]}} variant="h2">
          MIS Dashboard Under Construction
        </Typography>
      </div>
      );
  }
}
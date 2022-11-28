// eslint-disable-no-unused-vars
import React from 'react';
import { Grid, TextField, Typography, Button, Zoom, Alert } from '@mui/material';
import { AccountCircle, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import { socket } from '../../../websocket/socket';
import { user } from '../../../objects/User';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF',
  alertWarning: '#eb8f34',
  alertSuccess: 'green'
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

export default class MisEventsCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      expiry_timestamp: new Date().getTime(),
      alertMsg: '',
      alertSeverity: "warning",
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Grid container style={styles.container}>
        <Grid item xs={12}>
          <Typography variant="h1" style={{ margin: '10px' }}>Create new event</Typography>
        </Grid>
        <Grid container xs={12} rowSpacing={'10px'} columnSpacing={'10px'} style={{ margin: '10px' }}>
          <Grid item xs={12}>
            <Zoom in={this.state.alertMsg == '' ? false:true} unmountOnExit mountOnEnter>
              <Alert variant= "outlined" severity={this.state.alertSeverity} sx={styles.alertBox[this.state.alertSeverity]}>{this.state.alertMsg}</Alert>
            </Zoom>
          </Grid>
          <Grid item xs={6}>
            <TextField required variant="filled" style={{ width: '100%' }} color='textField1' label="Title" onChange={(e) => this.setState({ title: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Event Expiry"
              color="textField1"
              type="date"
              defaultValue={new Date()}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => this.setState({ expiry_timestamp: new Date(event.target.value).getTime() })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField required multiline rows={3} sx={{ width: '100%' }} variant="filled" color='textField1' label="Body" onChange={(e) => this.setState({ body: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="button1" onClick={() => {
              socket.emit('events/create', {
                title: this.state.title,
                body: this.state.body,
                expiry_timestamp: this.state.expiry_timestamp
              },res => {
                this.setState({
                  alertMsg: res.code == 200 ? "Event created successfully":`${res.status}: ${res.message}`,
                  alertSeverity: res.code == 200 ? 'success':'warning'
                }, () => setTimeout(() => this.setState({alertMsg: ''}), 3000))
                if (res.code == 200) {
                  this.setState({
                    alertMsg: "Event created successfully",
                    alertSeverity: 'success'
                  }, () => setTimeout(() => this.setState({alertMsg: ''}), 3000))
                }
              })
            }}>Create</Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
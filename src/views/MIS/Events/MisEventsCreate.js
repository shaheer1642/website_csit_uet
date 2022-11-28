// eslint-disable-no-unused-vars
import React from 'react';
import { Grid, TextField, Typography, Button } from '@mui/material';
import { AccountCircle, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import { socket } from '../../../websocket/socket';
import {user} from '../../../objects/User';

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
  }
}

export default class MisEventsCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      expiry_timestamp: -1
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
          <Grid item xs={6}>
            <TextField required variant="filled" style={{width: '100%'}} color='textField1' label="Title" onChange={(e) => this.setState({title: e.target.value})}/>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Event Expiry"
              color="textField1"
              type="date"
              defaultValue="2017-05-24" 
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => this.setState({expiry_timestamp: new Date(event.target.value).getTime()})}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField required multiline rows={3} sx={{ width: '100%' }} variant="filled" color='textField1' label="Body" onChange={(e) => this.setState({body: e.target.value})}/>
          </Grid>
          <Grid item xs={12}>
        <Button variant="contained" color="button1" onClick={() => {
          socket.emit('events/create', {
            user_id: user.user_id,
            title: this.state.title,
            body: this.state.body,
            expiry_timestamp: this.state.expiry_timestamp
          })
        }}>Create</Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
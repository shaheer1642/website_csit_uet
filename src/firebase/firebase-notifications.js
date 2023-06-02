import {useState} from 'react';
import { fetchToken, messaging } from './firebase';
import { onMessage } from "firebase/messaging";
import {Snackbar} from '@mui/material';
import React from 'react';

class FirebaseNotifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      notification: {title: '', body: ''},
      isTokenFound: false,
    }
  }
  componentDidMount() {
    fetchToken((value) => this.setState({isTokenFound: value}));
    onMessage(messaging, (payload) => {
      console.log('[Firebase FCM] New notification; Payload:', payload);
      this.setState({
        notification: {
          title: payload.notification.title, 
          body: payload.notification.body
        },
        show: true
      })
    });
  }
  render() {
    return (
      <Snackbar
          open={this.state.show}
          autoHideDuration={6000}
          onClose={() => this.setState({show: false})}
          message={this.state.notification.body}
      />
    );
  }
}

export default FirebaseNotifications;
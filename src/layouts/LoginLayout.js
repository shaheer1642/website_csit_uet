// eslint-disable-disable-next-line
import {socket,socketHasConnected} from '../websocket/socket'
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Tabs, Tab, Grid, List, ListItem, ListItemText, Divider, Typography} from '@mui/material';
import { Box } from '@mui/system';
import login_banner from '../images/login_banner.jpg'
import EstablishingConnection from '../views/EstablishingConnection';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF'
}

const styles = {
  container: {
    color: palletes.primary,
    
    display: 'flex',
    margin: 0,
    padding: 0,
    flex: 1,
    flexDirection: 'column',
    height: "100vh",
    width: "100vw",
    //backgroundImage: `url(${login_banner})`,
    //backgroundSize: 'cover',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    background: [
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],

    width: "100%",
    alignSelf: 'flex-start',
  
    //opacity: 0.8
  },
  body: {
    display: 'flex',
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: "100%",
  },
  footer: {
    display: 'flex',
    flex: 1,
    background: [
      
      "linear-gradient(90deg, rgba(158,229,255,1) 23%, rgba(255,255,255,1) 100%)"
    ],

    width: "100%",
    alignSelf: 'flex-end',
    //opacity: 0.8
  }
}

class LoginLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socketConnecting: true,
    };
  }

  componentDidMount() {
    console.log('[LoginLayout] componentDidMount')
    socketHasConnected().then(() => this.setState({socketConnecting: false})).catch(console.error)
    socket.on('connect', this.SocketConnectedListener)
    socket.on('disconnect', this.SocketDisconnectedListener)
  }

  componentWillUnmount() {
    console.log('[LoginLayout] componentWillUnmount')
    socket.removeListener(this.SocketConnectedListener)
    socket.removeListener(this.SocketDisconnectedListener)
  }

  SocketConnectedListener = () => this.setState({socketConnecting: false})
  SocketDisconnectedListener = () => this.setState({socketConnecting: true})

  render() {
    return (
      <React.Fragment>
        {this.state.socketConnecting ? <EstablishingConnection />:
          <div style={styles.container}>

            <div style={styles.body}>
              <Outlet/>
            </div>

          </div>
        }
      </React.Fragment>
    );
  }
}

export default LoginLayout;
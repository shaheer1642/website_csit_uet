// eslint-disable-disable-next-line
import {socket,socketHasConnected} from '../websocket/socket'
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Tabs, Tab, Grid, List, ListItem, ListItemText, Divider, Typography, Drawer} from '@mui/material';
import { Box } from '@mui/system';
import login_banner from '../images/login_banner.jpg'
import EstablishingConnection from '../views/EstablishingConnection';
import {user} from '../objects/User';
import { withRouter } from '../withRouter';

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
    flex: 1,
    background: [
      "red"
    ],
    width: "100%",
    alignSelf: 'flex-start',
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: "100%",
    height: "100%"
  },
  footer: {
    display: 'flex',
    flex: 1,
    background: [
      "blue"
    ],
    width: "100%",
    alignSelf: 'flex-end',
    //opacity: 0.8
  },
  tabStyle: {
    background: {
      color: '#FAA567'
    },
    indicatorColor: {
      sx: {
        backgroundColor: '#DE2D18',
      },
    },
    label: {
      color: 'white'
    },
    active: {
      color: '#DE2D18'
    },
  },
  list: {
    backgroundColor: 'grey',
    width: '100%',
    height: '100%'
  }
}

class MisLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socketConnecting: true,
      drawerValue: 0
    };
    
  }

  componentDidMount() {
    console.log('[MisLayout] componentDidMount')
    socketHasConnected().then(() => this.setState({socketConnecting: false})).catch(console.error)
    socket.on('connect', this.SocketConnectedListener)
    socket.on('disconnect', this.SocketDisconnectedListener)
  }

  componentDidUpdate() {
    console.log('[MisLayout] componentDidUpdate')
    if (!user.login_token) {
      this.props.navigate("/login")
    }
  }

  componentWillUnmount() {
    console.log('[MisLayout] componentWillUnmount')
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
            <div style={styles.header}>
            </div>
            <div style={styles.body}>
              <div style={{display: 'flex', flex: 1, width: '100%', height: '100%'}}>
                  <List style={styles.list}>
                      <ListItem button component={Link} to="">
                        <ListItemText primary="Home" />
                      </ListItem>
                      <ListItem button component={Link} to="events">
                        <ListItemText primary="Events" />
                      </ListItem>
                  </List>
              </div>
              <div style={{backgroundColor: 'yellow', flex: 3}}>
                <Outlet />
              </div>
            </div>
            <div style={styles.footer}>

            </div>
          </div>
        }
      </React.Fragment>
    );
  }
}

export default withRouter(MisLayout)
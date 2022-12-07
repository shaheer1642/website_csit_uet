// eslint-disable-disable-next-line
import {socket,socketHasConnected} from '../websocket/socket'
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Tabs, Tab, Grid, List, ListItem, ListItemText, Divider, Typography, Drawer, IconButton} from '@mui/material';
import {Logout} from '@mui/icons-material';
import { Box } from '@mui/system';
import login_banner from '../images/login_banner.jpg'
import EstablishingConnection from '../views/EstablishingConnection';
import {user} from '../objects/User';
import { withRouter } from '../withRouter';
import CustomButton from '../components/CustomButton';
import { generateNewToken } from '../websocket/socket';
import eventHandler from '../eventHandler';
import * as Color from '@mui/material/colors';

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
    backgroundColor: 'white',
    borderBottom: `5px solid ${Color.orange[200]}`,
    width: "100%",
    alignSelf: 'flex-start',
    maxHeight: '10%'
  },
  body: {
    height: '80%'
  },
  footer: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'white',
    borderTop: `5px solid ${Color.orange[200]}`,
    width: "100%",
    alignSelf: 'flex-end',
    maxHeight: '10%'
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
    backgroundColor: 'white',
    borderRight: `5px solid ${Color.orange[200]}`,
    width: '100%',
    height: '100%',
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

  onLogoutClick = () => {
    generateNewToken()
    eventHandler.emit('login/auth', {})
    this.props.navigate("/login")
  }

  render() {
    return (
      <React.Fragment>
        {this.state.socketConnecting ? <EstablishingConnection />:
          <div style={styles.container}>
            <div style={styles.header}>
              <CustomButton onClick={() => this.onLogoutClick()} style={{marginLeft: 'auto', height: '50%', alignSelf: 'center'}} startIcon={<Logout />} label="Logout" />
            </div>
            <Grid container style={styles.body} rowSpacing='10px'>
              <Grid item style={{width: '10%'}}>
                  <List style={styles.list}>
                      <ListItem button component={Link} to="">
                        <ListItemText primary="Home" />
                      </ListItem>
                      <ListItem button component={Link} to="events">
                        <ListItemText primary="Events" />
                      </ListItem>
                  </List>
              </Grid>
              <Grid item style={{display:'flex',alignItems: 'center', justifyContent: 'center', width: '90%'}}>
                <Outlet />
              </Grid>
            </Grid>
            <div style={styles.footer}>

            </div>
          </div>
        }
      </React.Fragment>
    );
  }
}

export default withRouter(MisLayout)
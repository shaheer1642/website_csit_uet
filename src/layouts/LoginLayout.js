// eslint-disable-disable-next-line
import {socket,socketHasConnected} from '../websocket/socket'
import React from 'react';
import { Link, Outlet } from "react-router-dom";
import {Tabs, Tab, Grid, List, ListItem, ListItemText, Divider, Typography} from '@mui/material';
import { Box } from '@mui/system';
import login_banner from '../images/login_banner.jpg'

const palletes = {
  primary: '#26768c',
  secondary: '#c16a3f'
}

const styles = {
  container: {
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
    backgroundColor: palletes.primary,
    borderBottom: "4px solid " + palletes.secondary,
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
    backgroundColor: palletes.primary,
    borderTop: "4px solid " + palletes.secondary,
    width: "100%",
    alignSelf: 'flex-end',
    //opacity: 0.8
  }
}

class LoginLayout extends React.Component {

  async componentDidMount() {
    console.log('[LoginLayout] componentDidMount')
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.header}>

        </div>
        <div style={styles.body}>
          <Outlet/>
        </div>
        <div style={styles.footer}>

        </div>
      </div>
    );
  }
}

export default LoginLayout;
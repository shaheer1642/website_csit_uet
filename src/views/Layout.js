import '../App.css';
import {socket,socketHasConnected} from '../websocket/socket'
import React from 'react';
import { Outlet, Link } from "react-router-dom";


class Layout extends React.Component {


  async componentDidMount() {
    console.log('[Layout] componentDidMount')
    await socketHasConnected();
    socket.emit("ping", 'custom-data-sent-from-client', (data) => console.log('received data from socket', data))
  }

  render() {
    const tablink = {
      color: "white",
      backgroundColor: "DodgerBlue",
      padding: "10px",
      fontFamily: "Arial"
    };

    return (
      <div className="App">
        <header className="App-header">
          <div style={{width: "100vw"}}>
          <nav>
                <Link to="/">
                  <button style={tablink} type="button">Home Page</button>
                </Link>
                <Link to="/about">
                  <button style={tablink} type="button">About</button>
                </Link>
          </nav>
          </div>
          <Outlet />
        </header>
      </div>
      );
  }
}

export default Layout;
import logo from '../logo.svg';
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
    return (
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
          <Outlet />
        </header>
      </div>
      );
  }
}

export default Layout;

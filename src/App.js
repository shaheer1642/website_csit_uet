import logo from './logo.svg';
import './App.css';
import {socket,socketHasConnected} from './websocket/socket'
import React from 'react';

class App extends React.Component {

  async componentDidMount() {
    console.log('[App] componentDidMount')
    await socketHasConnected();
    socket.emit("ping", 'custom-data-sent-from-client', (data) => console.log('received data from socket', data))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
      );
  }
}

export default App;

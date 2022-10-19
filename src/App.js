import logo from './logo.svg';
import './App.css';
import {socket,socketHasConnected} from './websocket/socket'
import React from 'react';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {events: []};
  }

  async componentDidMount() {
    console.log('[App] componentDidMount')
    await socketHasConnected();
    socket.emit("events/fetch", {}, (res) => {
      //console.log(res)
      this.setState({
        events: res
      },() => {
        console.log(this.state.events[0].title)
      })
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reloading.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {this.state.events.map(ele => {
            return (
              <p>{ele.title}</p>
            )
          })}
        </header>
      </div>
      );
  }
}

export default App;

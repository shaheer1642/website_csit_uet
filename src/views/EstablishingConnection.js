
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

const palletes = {
  primary: '#439CEF',
  secondary: '#FFFFFF'
}

const styles = {
  container: {
    backgroundColor:palletes.primary,
    background: [
      "linear-gradient(to right top, #3760bb, #0e85d5, #13a9e7, #4bcbf4, #81ecff)"
    ],
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100vw",
    height: "100vh",
  },
}

export default class EstablishingConnection extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <div style={{display: 'flex', flexDirection: 'row', color: 'white'}}>
          <Spinner animation="grow" size="sm" />
          <Spinner animation="grow" />
        </div>
        <div style={{marginTop: 20, fontSize: 28, color: 'white'}}>
          Establishing Connection
        </div>
      </div>
    );
  }
}

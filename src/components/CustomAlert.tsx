// @ts-nocheck
import React from 'react';
import { Alert, AlertColor, Zoom } from '@mui/material';

const palletes = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  alertWarning: '#eb8f34',
  alertSuccess: 'green'
}

const styles = {
    alertBox: {
      warning: {
        width: '100%',
        borderRadius: 0,
        color: palletes.alertWarning, // text color
        borderColor: palletes.alertWarning,
        my: '10px',
        py: "5px",
        px: "10px",
        '& .MuiAlert-icon': {
          color: palletes.alertWarning, // icon color
        },
      },
      success: {
        width: '100%',
        borderRadius: 0,
        color: palletes.alertSuccess, // text color
        borderColor: palletes.alertSuccess,
        my: '10px',
        py: "5px",
        px: "10px",
        '& .MuiAlert-icon': {
          color: palletes.alertSuccess, // icon color
        },
      }
    }
  }

interface IProps {
    message: string,
    severity: AlertColor
}

interface IState {
}
  

export default class CustomAlert extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
          message: '',
        };
        this.alertTimeout = null
    }

    componentDidMount(): void {
    }
    componentDidUpdate(): void {
    }
    componentWillUnmount(): void {
    }
    
    render() {
        return (
            this.props.message ?
            <Zoom in={this.props.message == '' ? false : true} unmountOnExit mountOnEnter>
              <Alert variant="outlined" severity={this.props.severity || 'warning'} sx={styles.alertBox[this.props.severity || 'warning']}>{this.props.message}</Alert>
            </Zoom> : <></>
        )
    }
}
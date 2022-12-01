
import React from 'react';
import { Modal, Typography, Grid, Box } from '@mui/material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';

const defaultStyles = {
}

interface IProps {
  open: boolean,
  title: string,
  body: string
}

interface IState {
  open: boolean,
}

export default class CustomModal extends React.Component<IProps,IState> {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open
    }
  }

  render() {
    const styles = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    return (
      <Modal
        open={this.state.open}
        onClose={() => this.setState({open: this.state.open})}
      >
        <Grid container sx={styles}>
          <Typography variant="h6" component="h2">
            {this.props.title}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {this.props.body}
          </Typography>
        </Grid>
      </Modal>
    )
  }
}
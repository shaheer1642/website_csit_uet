// @ts-nocheck
import React from 'react';
import { Box, IconButton, Modal } from '@mui/material';
import { SxProps, Theme } from '@mui/material';
import { Cancel, Close } from '@mui/icons-material';

const containerStyle = {
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

interface IProps {
  open: boolean,
  onClose: Function,
  containerStyle: SxProps<Theme>
}

interface IState {
}

export default class CustomModal extends React.Component<IProps,IState> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={() => this.props.onClose()}
      >
        <Box sx={{...containerStyle, ...(this.props.containerStyle || {})}}>
          <IconButton sx={{position: 'absolute', right: 5, top: 5 }} onClick={this.props.onClose}><Cancel /></IconButton>
          {this.props.children}
        </Box>
      </Modal>
    )
  }
}
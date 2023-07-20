// @ts-nocheck
import React from 'react';
import { Box, IconButton, Modal } from '@mui/material';
import { SxProps, Theme } from '@mui/material';
import { Cancel, Close } from '@mui/icons-material';


interface IProps {
  open: boolean,
  onClose: Function,
  containerStyle: SxProps<Theme>,
  width: string
}

interface IState {
}

export default class CustomModal extends React.Component<IProps,IState> {
  constructor(props) {
    super(props);
    this.containerStyle = {
      // position: 'absolute' as 'absolute',
      // top: '50%',
      // left: '50%',
      // transform: 'translate(-50%, -50%)',
      width: this.props.width || 400,
      // maxHeight: '80vh',
      // scroll: 'auto',
      backgroundColor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      // p: 4,
      m: 4,
      p: 4,
      // maxHeight: '80vh',
      minHeight: '50vh',
      maxHeight: '80vh',
      overflow: 'auto',
      position: 'relative'
    };
  }

  
  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={() => this.props.onClose()}
        sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}
      >
        <Box sx={{...this.containerStyle, ...(this.props.containerStyle || {})}}>
          <IconButton sx={{position: 'absolute', right: 5, top: 5 }} onClick={this.props.onClose}><Cancel /></IconButton>
          {this.props.children}
        </Box>
      </Modal>
    )
  }
}
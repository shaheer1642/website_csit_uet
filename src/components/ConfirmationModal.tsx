// @ts-nocheck
import React from 'react';
import { Modal, Typography, Grid, Box, ButtonGroup } from '@mui/material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';
import CustomButton from './CustomButton';

interface IProps {
  open: boolean,
  message: string,
  onClose: Function,
  onClickYes: Function,
  onClickNo: Function,
}

interface IState {
}

export default class ConfirmationModal extends React.Component<IProps,IState> {
  constructor(props) {
    super(props);
  }

  render() {
    const styles = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: "30%",
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    return (
      <Modal
        open={this.props.open || false}
        onClose={() => this.props.onClose()}
      >
        <Grid container sx={styles} rowSpacing='20px'>
          <Grid item xs={12}>
            <Typography sx={{ mt: 2 }}>
              {this.props.message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup fullWidth>
              <CustomButton label='Yes' style={{backgroundColor: 'red'}} onClick={() => this.props.onClickYes()}/>
              <CustomButton label='No' variant='outlined' onClick={() => this.props.onClickNo()}/>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Modal>
    )
  }
}
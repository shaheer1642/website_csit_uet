// @ts-nocheck
import React from 'react';
import { Button, Grid } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';

interface IProps {
  context: any,
  style?: React.CSSProperties | undefined,
}

export default class GoBackButton extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid item xs={12} style={this.props.style}>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => this.props.context(-1)}>Back</Button>
      </Grid>
    )
  }
}
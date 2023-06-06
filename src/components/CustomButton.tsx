// @ts-nocheck
import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';

const defaultStyles = {
  /*
  colors: {
      labelColor: 'white',
      backgroundColor: Color.orange[700],
      hoverLabelColor: 'white',
      hoverBackgroundColor: Color.orange[900]
  },
  */
  font: {
    size: "14px",
  }
}

interface IProps {
  label: string,
  variant?: "text" | "contained" | "outlined" | undefined,
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
  tabIndex?: number,
  fontSize?: number,
  fontFamily?: string,
  //labelColor?: string,
  //backgroundColor?: string,
  //hoverLabelColor?: string,
  //hoverBackgroundColor?: string,
  disabled?: boolean,
  sx?: SxProps<Theme> | undefined,
  style?: React.CSSProperties | undefined,
  startIcon?: React.ReactNode,
  endIcon?: React.ReactNode,
  size?: string,
  component?: React.Component,
  color?: string,
  callingApiState?: boolean
}

export default class CustomButton extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const styles = {
      fontSize: this.props.fontSize || defaultStyles.font.size,
      fontFamily: this.props.fontFamily || defaultStyles.font.family,
      /*
      color: this.props.labelColor || defaultStyles.colors.labelColor,
      backgroundColor: this.props.backgroundColor || defaultStyles.colors.backgroundColor,
      '&:hover': {
        backgroundColor: this.props.hoverBackgroundColor || defaultStyles.colors.hoverBackgroundColor,
        color: this.props.hoverLabelColor || defaultStyles.colors.hoverLabelColor,
      }
      */
    }

    return (
      <Button
        size={this.props.size}
        component={this.props.component}
        color={this.props.color || "primary"}
        sx={{ ...styles, ...this.props.sx }}
        style={this.props.style}
        onClick={this.props.onClick}
        disabled={this.props.disabled || this.props.callingApiState}
        variant={this.props.variant || "contained"}
        tabIndex={this.props.tabIndex}
        startIcon={this.props.callingApiState ? <CircularProgress size='20px' /> : this.props.startIcon}
        endIcon={this.props.endIcon}
      >{this.props.label}</Button>
    )
  }
}
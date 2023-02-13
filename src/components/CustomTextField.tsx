// @ts-nocheck
import React from 'react';
import { TextField } from '@mui/material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';

const defaultStyles = {
    colors: {
        inputTextColor: 'black',

        labelColor: 'grey',
        labelFocusedColor: Color.orange[700],

        underlineColor: 'grey',
        underlineFocusedColor: Color.orange[700],
    },
    font: {
        size: "18px",
        family: "Arial"
    }
}

interface IProps {
    label: string,
    value?: string,
    variant?: "standard" | "filled",
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    onFocus?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined,
    tabIndex?: number,
    fontSize?: number,
    fontFamily?: string,
    inputTextColor?: string,
    labelColor?: string,
    labelFocusedColor?: 'black',
    underlineFocusedColor?: string,
    underlineColor?: string,
    sx?: SxProps<Theme>,
    style?: React.CSSProperties,
    type?: React.HTMLInputTypeAttribute,
    required?: boolean,
    multiline?: boolean,
    rows?: number,
    maxRows?: number,
    onPressEnter?: Function,
    placeholder?: string,
    disabled?: boolean
}

export default class CustomTextField extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const styles = {
        fontSize: this.props.fontSize || defaultStyles.font.size,
        fontFamily: this.props.fontFamily || defaultStyles.font.family,

    
        '& .MuiInput-underline:before': { borderBottomColor: this.props.underlineColor || defaultStyles.colors.underlineColor },
        '& .MuiInput-underline:after': { borderBottomColor: this.props.underlineFocusedColor || defaultStyles.colors.underlineFocusedColor },
        '& .MuiFilledInput-underline:before': { borderBottomColor: this.props.underlineColor || defaultStyles.colors.underlineColor },
        '& .MuiFilledInput-underline:after': { borderBottomColor: this.props.underlineFocusedColor || defaultStyles.colors.underlineFocusedColor },

        '& .MuiInput-input': { color: this.props.inputTextColor || defaultStyles.colors.inputTextColor },

        '& .MuiIFormLabel-root': {color: this.props.labelColor || defaultStyles.colors.labelColor },
        '& .MuiInputLabel-standard': { color: this.props.labelColor || defaultStyles.colors.labelColor },
        '& .MuiInputLabel-filled': { color: this.props.labelColor || defaultStyles.colors.labelColor },
        '& .MuiInputLabel-shrink': { color: this.props.labelFocusedColor || defaultStyles.colors.labelFocusedColor },
        
    }

    return (
        <TextField
            color="primary"
            disabled={this.props.disabled}
            value={this.props.value}
            placeholder={this.props.placeholder}
            label={this.props.label} 
            variant={this.props.variant || "standard"}
            sx= {{...styles, ...this.props.sx}}
            style= {this.props.style}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            type={this.props.type || 'text'}
            inputProps={{ tabIndex: this.props.tabIndex }}
            required={this.props.required}
            multiline={this.props.multiline}
            rows={this.props.rows}
            maxRows={this.props.maxRows}
            onKeyUp={(e) => {
                if (e.key == 'Enter') return this.props.onPressEnter ? this.props.onPressEnter() : {}
            }}
        />
    )
  }
}
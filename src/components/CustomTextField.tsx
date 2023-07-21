// @ts-nocheck
import React from 'react';
import { TextField } from '@mui/material';
import { SxProps, Theme } from '@mui/material';

const defaultStyles = {
    colors: {
        inputTextColor: 'black',

        labelColor: 'grey',
        labelFocusedColor: 'primary.dark',

        underlineColor: 'grey',
        underlineFocusedColor: 'primary.dark',
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
    fullWidth?: boolean,
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    onFocus?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined,
    tabIndex?: number,
    size?: "small" | "medium",
    fontSize?: number,
    fontFamily?: string,
    inputTextColor?: string,
    labelColor?: string,
    labelFocusedColor?: string,
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
    disabled?: boolean,
    range?: Array<number>,
    readOnly?: boolean,
    InputLabelProps?: Object
}

export default class CustomTextField extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef()
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

        '& .MuiInputLabel-root': {
            color: this.props.labelColor || defaultStyles.colors.labelColor,
            '&.Mui-focused': {
                color: this.props.labelFocusedColor || defaultStyles.colors.labelFocusedColor 
            },
        },
        
    }

    // const width = this.props.value ? this.props.value.length * 8.5 : undefined

    return (
        <TextField
            inputRef={this.inputRef}
            fullWidth={this.props.fullWidth}
            color="primary"
            size={this.props.size}
            disabled={this.props.disabled}
            value={this.props.value || ''}
            placeholder={this.props.placeholder}
            label={this.props.label} 
            variant={this.props.variant || (this.props.type == 'date' ? 'outlined' : "standard")}
            sx= {{
                ...styles, 
                // minWidth: width && width > 250 ? `${width}px` : `250px`,
                ...this.props.sx
            }}
            style= {this.props.style}
            onChange={this.props.readOnly ? undefined : this.props.onChange}
            onFocus={this.props.onFocus}
            type={this.props.type || 'text'}
            inputProps={{ 
                tabIndex: this.props.tabIndex, 
                min: this.props.range?.[0], 
                max: this.props.range?.[1], 
                readOnly: this.props.readyOnly,
            }}
            required={this.props.required}
            multiline={this.props.multiline}
            rows={this.props.rows}
            maxRows={this.props.maxRows}
            onKeyUp={(e) => {
                if (e.key == 'Enter') return this.props.onPressEnter ? this.props.onPressEnter() : {}
            }}
            InputLabelProps={this.props.InputLabelProps}
            onClick={(e) => {
                if (this.props.type == 'date' && !this.props.readOnly) 
                    this.inputRef.current.showPicker()
            }}
        />
    )
  }
}
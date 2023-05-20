// @ts-nocheck
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField } from '@mui/material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';
import LoadingIcon from './LoadingIcon';
import { socket } from '../websocket/socket';

interface IProps {
    endpoint: string | undefined,
    endpointData?: Object | undefined,
    menuItems: Array<any> | undefined,
    value: string | undefined,
    label: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    required: boolean | undefined,
    disabled: boolean | undefined,
    sx: SxProps<Theme>
}

interface IState {
    componentLoading: boolean,
    menuItems: Array<any>,
}
  

export default class CustomSelect extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            componentLoading: true,
            menuItems: this.props.menuItems || []
        };
    }

    componentDidMount(): void {
        if (this.props.endpoint) {
            socket.emit(this.props.endpoint, this.props.endpointData || {}, res => {
                if (res.code == 200) {
                    this.setState({menuItems: [...this.state.menuItems, ...res.data], componentLoading: false})
                }
            })
        } else {
            this.setState({componentLoading: false})
        }
    }
    
//     <FormControl fullWidth required={this.props.required} sx={this.props.sx}>
//     <InputLabel>{this.props.label}</InputLabel>
//     <Select
//         disabled={this.props.disabled}
//         value={this.props.value || ''}
//         label={this.props.label}
//         onChange={this.props.onChange}
//         required={this.props.required}
//     >
//         {this.state.menuItems.map(item => 
//             (<MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)
//         )}
//     </Select>
// </FormControl>

    render() {
        return (
            this.state.componentLoading ? <LoadingIcon />:
            <Autocomplete
                disablePortal
                options={this.state.menuItems}
                renderInput={(params) => <TextField {...params} label={this.props.label} />}
                onChange={this.props.onChange}
                required={this.props.required}
                value={this.state.menuItems.filter(option => option.id == this.props.value)[0]}
                sx={this.props.sx}
            />
        )
    }
}
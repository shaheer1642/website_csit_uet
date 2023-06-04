// @ts-nocheck
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField, Popper } from '@mui/material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';
import LoadingIcon from './LoadingIcon';
import { socket } from '../websocket/socket';

interface IProps {
    endpoint: string | string[] | undefined,
    endpointData?: Object | Object[] | undefined,
    menuItems: Array<any> | undefined,
    value: string | undefined,
    label: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    required: boolean | undefined,
    disabled: boolean | undefined,
    readOnly: boolean | undefined,
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
        if (!this.props.endpoint) return this.setState({componentLoading: false})
        if (Array.isArray(this.props.endpoint)) {
            Promise.all(this.props.endpoint.map((endpoint,index) => 
                new Promise((resolve,reject) => {
                    socket.emit(endpoint, this.props.endpointData?.[index] || {}, res => {
                        if (res.code == 200) {
                            resolve(res)
                        } else reject(res)
                    })
                }))
            ).then(responses => {
                this.setState({menuItems: [...this.state.menuItems, ...responses.reduce((arr,res) => ([...arr,...res.data]),[])], componentLoading: false})
            }).catch(console.error)
        } else {
            socket.emit(this.props.endpoint, this.props.endpointData || {}, res => {
                if (res.code == 200) {
                    this.setState({menuItems: [...this.state.menuItems, ...res.data], componentLoading: false})
                }
            })
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
                readOnly = {this.props.readOnly}
                disablePortal
                options={this.state.menuItems}
                renderInput={(params) => <TextField {...params} label={this.props.label} />}
                onChange={this.props.onChange}
                required={this.props.required}
                value={this.state.menuItems.filter(option => option.id == this.props.value)[0]}
                sx={{...this.props.sx}}
            />
        )
    }
}
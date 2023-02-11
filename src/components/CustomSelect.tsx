// @ts-nocheck
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';
import LoadingIcon from './LoadingIcon';
import { socket } from '../websocket/socket';

interface IProps {
    endpoint: string | undefined,
    menuItems: Array<any> | undefined,
    defaultValue: string | undefined,
    label: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
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
            socket.emit(this.props.endpoint, {}, res => {
                if (res.code == 200) {
                    this.setState({menuItems: res.data, componentLoading: false})
                }
            })
        } else {
            this.setState({componentLoading: false})
        }
    }
    
    render() {
        return (
            this.state.componentLoading ? <LoadingIcon />:
            <FormControl fullWidth>
                <InputLabel>{this.props.label}</InputLabel>
                <Select
                    defaultValue={this.props.defaultValue || ''}
                    label={this.props.label}
                    onChange={this.props.onChange}
                >
                    {this.state.menuItems.map(item => 
                        (<MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)
                    )}
                </Select>
            </FormControl>
        )
    }
}
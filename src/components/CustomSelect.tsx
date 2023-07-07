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
    sx: SxProps<Theme>,
    forceCallApi?: Function
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
            menuItems: []
        };
    }

    componentDidMount(): void {
        this.callApi()
    }

    updateMenuItems = (items, callback) => {
        this.setState({
            menuItems: [...(this.props.menuItems || []), ...(items || [])]
        }, () => {
            if (callback) callback()
        })
    }

    callApi = () => {
        if (!this.props.endpoint) return this.updateMenuItems([], () => this.setState({componentLoading: false}))
        this.setState({componentLoading: true})
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
                this.updateMenuItems(responses.reduce((arr,res) => ([...arr,...res.data]),[]) , () => this.setState({componentLoading: false}))
            }).catch(console.error)
        } else {
            socket.emit(this.props.endpoint, this.props.endpointData || {}, res => {
                if (res.code == 200) {
                    this.updateMenuItems(res.data , () => this.setState({componentLoading: false}))
                }
            })
        }
    }

    render() {
        const width = this.props.value ? this.state.menuItems.filter(option => option.id == this.props.value)?.[0]?.label.length * 12 : undefined
        if (this.props.forceCallApi) {
            this.callApi()
            this.props.forceCallApi()
        }
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
                sx={{minWidth: width && width > 250 ? `${width}px` : `250px`,...this.props.sx}}
            />
        )
    }
}
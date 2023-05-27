// @ts-nocheck
import React from 'react';
import { Autocomplete, TextField, Checkbox, Chip} from '@mui/material';
import * as Color from '@mui/material/colors';
import { SxProps, Theme } from '@mui/material';
import LoadingIcon from './LoadingIcon';
import { socket } from '../websocket/socket';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface IProps {
    endpoint?: string | undefined,
    endpointData?: Object | undefined,
    menuItems?: Array<any> | undefined,
    values?: Array<string> | undefined,
    label: string,
    onChange?: ((event: React.SyntheticEvent<Element, Event>, value: any[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any> | undefined) => void) | undefined,
}
  
interface IState {
    componentLoading: boolean,
    menuItems: Array<any>,
}
  

export default class CustomMultiAutocomplete extends React.Component<IProps, IState> {
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
            <Autocomplete
                disableClearable
                multiple
                options={this.state.menuItems}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.label}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField {...params} label={this.props.label}/>
                )}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                    <Chip
                        label={option.label}
                        {...getTagProps({ index })}
                        onDelete={undefined}
                    />
                    ))
                }
                onChange={this.props.onChange}
                value={this.state.menuItems.filter(option => this.props.values?.includes(option.id))}
                isOptionEqualToValue={(option, value) => option.id == value.id}
        />
        )
    }
}
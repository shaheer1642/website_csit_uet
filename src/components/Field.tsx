// @ts-nocheck
import React from 'react';
import { Typography, Grid } from '@mui/material';
import { convertUpper } from '../extras/functions';

interface IProps {
    name: string,
    value: string,
    alignment: 'horizontal' | 'vertical',
    nameVariant: string,
    valueVariant: string
}

export default class Field extends React.Component<IProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container item xs={'auto'} direction={'row'} columnSpacing={1}>
                <Grid item xs={this.props.alignment == 'vertical' ? 12 : 'auto'}>
                    <Typography fontWeight={'bold'} variant={this.props.nameVariant || 'subtitle1'}>{convertUpper(this.props.name?.toString())}:</Typography>
                </Grid>
                <Grid item xs={this.props.alignment == 'vertical' ? 12 : 'auto'}>
                    <Typography variant={this.props.valueVariant ||'subtitle1'}>{convertUpper(this.props.value)}</Typography>
                </Grid>
            </Grid>
        );
    }
}

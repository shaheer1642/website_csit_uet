// @ts-nocheck
import React from 'react';
import { Typography, Grid } from '@mui/material';
import { convertUpper } from '../extras/functions';

interface IProps {
    name: string,
    value: string,
}

export default class Field extends React.Component<IProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container item xs={'auto'} direction={'row'} spacing={1}>
                <Grid item>
                    <Typography fontWeight={'bold'} variant='subtitle1'>{convertUpper(this.props.name?.toString())}:</Typography>
                </Grid>
                <Grid item>
                    <Typography variant='subtitle1'>{convertUpper(this.props.value?.toString())}</Typography>
                </Grid>
            </Grid>
        );
    }
}

// @ts-nocheck
import React from 'react';
import { Card } from '@mui/material';

interface IProps {
    style?: React.CSSProperties | undefined,
}

const defaultStyles = {
  borderRadius: 5,
  padding: 4
}

export default class CustomCard extends React.Component<IProps> {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <Card sx={{...defaultStyles, ...this.props.style}} elevation={3}>
              {this.props.children}
            </Card>
        );
    }
}

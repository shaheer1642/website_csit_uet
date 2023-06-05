// @ts-nocheck
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Color from '@mui/material/colors';
import { Card, CardContent, CardActions } from '@mui/material';

interface IProps {
    color?: string | undefined,
    style?: React.CSSProperties | undefined,
    cardContent: any,
    cardActions: any
}

const defaultStyles = {
  borderRadius: 5,
  padding: 3
}

export default class CustomCard extends React.Component<IProps> {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <Card sx={{...defaultStyles, ...this.props.style}} elevation={3}>
              {this.props.cardContent}
              {this.props.cardActions}
              {this.props.children}
            </Card>
        );
    }
}

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

export default class CustomCard extends React.Component<IProps> {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <Card  sx={{margin: '20px', padding: '20px', borderRadius: 5}} elevation={3}>
              <CardContent>
                {this.props.cardContent}
              </CardContent>
              <CardActions>
                {this.props.cardActions}
              </CardActions>
            </Card>
        );
    }
}

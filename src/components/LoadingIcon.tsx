// @ts-nocheck
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Color from '@mui/material/colors';

interface IProps {
    color?: string | undefined,
    style?: React.CSSProperties | undefined,
}

export default class LoadingIcon extends React.Component<IProps> {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row', color: this.props.color || Color.deepPurple[500], margin: '20px', ...this.props.style}}>
                <Spinner animation="grow" size="sm" />
                <Spinner animation="grow" />
            </div>
        );
    }
}

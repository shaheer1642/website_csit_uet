// @ts-nocheck
import React from 'react';
// import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Color from '@mui/material/colors';
import theme from '../theme';

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
            <div style={{display: 'flex', flexDirection: 'row', color: this.props.color || theme.palette.primary.main, margin: '20px', ...this.props.style}}>
                <div className="spinner-grow spinner-grow-sm" role="status"></div>
                <div className="spinner-grow" role="status"></div>
            </div>
        );
    }
}

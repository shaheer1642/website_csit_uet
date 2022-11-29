
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IProps {
    color?: string | undefined,
    test?: string | undefined,
}

export default class LoadingIcon extends React.Component<IProps> {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row', color: this.props.color || 'blue', margin: '20px'}}>
                <Spinner animation="grow" size="sm" />
                <Spinner animation="grow" />
            </div>
        );
    }
}

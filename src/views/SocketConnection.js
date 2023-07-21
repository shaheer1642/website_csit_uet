/* eslint eqeqeq: "off", no-unused-vars: "off" */
import { Link, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { socket, socketHasConnected } from '../websocket/socket'
import * as React from 'react';
import { withRouter } from "../withRouter";
import { Alert, Snackbar, Typography } from "@mui/material";

class SocketConnection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socketConnecting: true,
            dotsCounter: 0,
        };
        this.interval = null
    }

    componentDidMount() {
        socketHasConnected().then(() => this.setState({ socketConnecting: false })).catch(console.error)
        socket.on('connect', this.SocketConnectedListener)
        socket.on('disconnect', this.SocketDisconnectedListener)
        this.interval = setInterval(() => {
            this.setState(state => ({
                dotsCounter: state.dotsCounter > 2 ? 0 : ++state.dotsCounter
            }))
        }, 1000); 
    }

    componentWillUnmount() {
        console.log('[MainLayout] componentWillUnmount')
        socket.removeListener(this.SocketConnectedListener)
        socket.removeListener(this.SocketDisconnectedListener)
        clearInterval(this.interval)
    }

    SocketConnectedListener = () => this.setState({ socketConnecting: false })
    SocketDisconnectedListener = () => this.setState({ socketConnecting: true })

    render() {
        return (
            <Snackbar anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} open={this.state.socketConnecting} sx={{ boxShadow: 16 }} >
                <Alert severity="error" sx={{ width: '100%', backgroundColor: 'common.white', color: 'error', px: 4, "& .MuiAlert-icon": { fontSize: 28 } }}>
                    <Typography variant="h5">
                        Connecting to server{'.'.repeat(this.state.dotsCounter)}
                    </Typography>
                </Alert>
            </Snackbar>
        );
    }
}

export default withRouter(SocketConnection);
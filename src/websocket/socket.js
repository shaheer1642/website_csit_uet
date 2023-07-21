import {io} from 'socket.io-client';
import * as uuid from 'uuid';
import eventHandler from '../eventHandler';
import { getCookie, putCookie } from '../cookie_handler';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports : ['websocket'],
    auth: {
        token: getCookie('login_token') || putCookie('login_token',uuid.v4())
    }
});

socket.on("connect", () => {
    console.log('[websocket] connected',socket.id)
});
  
socket.on("disconnect", () => {
    console.log('[websocket] disconnected')
});

async function socketHasConnected() {
    return new Promise((resolve,reject) => {
        if (socket.connected) return resolve(true)
        else {
            socket.on("connect", () => {
                return resolve(true)
            });
        }
    })
}

async function generateNewToken() {
    putCookie('login_token',uuid.v4())
    if (!socket) return
    //socket.emit('restartConn')
    socket.auth.token = getCookie('login_token')
    // eventHandler.emit('login/auth', undefined)
    await socketHasConnected()
    socket.disconnect()
    socket.connect()
}

export {
    socket,
    socketHasConnected,
    generateNewToken
}
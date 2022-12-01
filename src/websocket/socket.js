import {io} from 'socket.io-client';
import * as uuid from 'uuid';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports : ['websocket'],
    query: {
        token: uuid.v4()
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

export {
    socket,
    socketHasConnected
}
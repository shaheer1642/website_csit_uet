import {io} from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports : ['websocket'],
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
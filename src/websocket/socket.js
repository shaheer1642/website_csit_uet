import {io} from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports : ['websocket'],
});

socket.on("connect", () => {
    console.log('[websocket] connected',socket.id)
    socket.emit("ping",'custom-data-sent-from-client',(data) => console.log('received data from socket', data))
});
  
socket.on("disconnect", () => {
    console.log('[websocket] disconnected')
});

export {
    socket
}
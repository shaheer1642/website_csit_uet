import { socket, socketHasConnected } from "../websocket/socket"

const users_list = []

socketHasConnected().then(() => {
    fetchUsers()
})

function fetchUsers() {
    socket.emit('users/fetch',{},(res) => {
        if (res.code == 200) {
            res.data.forEach(user => {
                users_list[user.user_id] = user
            })
        }
    })
}

socket.on('users/listener/insert',() => {
    fetchUsers()
})
socket.on('users/listener/update',() => {
    fetchUsers()
})
socket.on('users/listener/delete',() => {
    fetchUsers()
})

function getUserNameById(user_id) {
    return users_list[user_id]?.name || user_id
}

export {
    getUserNameById
}

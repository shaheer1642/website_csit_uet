import { MakeGETCall } from "../api"
import { socket, socketHasConnected } from "../websocket/socket"

const users_list = {}

// socketHasConnected().then(() => {
//     fetchUsers()
// })

fetchUsers()

function fetchUsers() {
    MakeGETCall('/api/autocomplete/users').then(res => {
        res.forEach(user => {
            users_list[user.id] = { id: user.id, name: user.label }
        })
    }).catch(console.error)
    // socket.emit('users/fetch',{},(res) => {
    //     if (res.code == 200) {
    //         res.data.forEach(user => {
    //             users_list[user.user_id] = user
    //         })
    //     }
    // })
}

socket.on('users_changed', () => {
    fetchUsers()
})

function getUserNameById(user_id) {
    return users_list[user_id]?.name || user_id
}

export {
    getUserNameById
}

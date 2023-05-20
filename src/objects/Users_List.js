import { socket, socketHasConnected } from "../websocket/socket"

const users_list = []

socketHasConnected().then(() => {
    socket.emit('users/fetch',{},(res) => {
        console.log('usersfetch res',res)
        if (res.code == 200) {
            users_list = 
            res.data.forEach(user => {
                users_list[user.user_id] = user
            })
        }
    })
})

function getUserNameById(user_id) {
    console.log('[getUserNameById]',user_id,users_list[user_id]?.name)
    return users_list[user_id]?.name || user_id
}

export {
    getUserNameById
}

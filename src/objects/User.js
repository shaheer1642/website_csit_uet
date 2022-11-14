import eventHandler from "../eventHandler"

var user = {}

eventHandler.on('login/auth', (user_obj) => {
    console.log('[eventHandler] login/auth',user_obj)
    user = user_obj
})

export {user};
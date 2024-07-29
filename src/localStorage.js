const { socket } = require("./websocket/socket");

socket.on('students_changed', () => emptyLocalStorage('students'))
socket.on('students_batch_changed', () => emptyLocalStorage('students'))

// note: this is for clearing all cached data except tokens and such
Object.keys(localStorage).forEach(key => {
    if (key !== 'token') {
        localStorage.removeItem(key)
    }
})

function emptyLocalStorage(item) {
    console.log('[localStorage.emptyLocalStorage]', item, Object.keys(localStorage))
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(item)) {
            localStorage.removeItem(key)
        }
    })
}

function getCache(item) {
    try {
        return JSON.parse(localStorage.getItem(item))
    } catch (e) {
        return localStorage.getItem(item)
    }
}

function setCache(item, data) {
    localStorage.setItem(item, typeof data == 'string' ? data : JSON.stringify(data))
}

export {
    getCache,
    setCache
}
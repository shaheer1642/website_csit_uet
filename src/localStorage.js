const { socket } = require("./websocket/socket");

socket.on('students_changed', () => emptyLocalStorage('students/fetch'))
socket.on('students_batch_changed', () => emptyLocalStorage('students/fetch'))

// localStorage.clear()

function emptyLocalStorage(item) {
    console.log('[localStorage.emptyLocalStorage]', item)
    localStorage.removeItem(item)
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
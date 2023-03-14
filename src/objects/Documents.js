import eventHandler from "../eventHandler"
import { socket } from "../websocket/socket"

var global_documents = []

fetchDocuments()
socket.addEventListener("documents/listener/changed", fetchDocuments);

function fetchDocuments() {
    socket.emit("documents/fetch", {}, (res) => {
        if (res.code == 200) {
            global_documents = res.data
        }
    });
}

function getNameForUrl(url) {
    var name = ''
    global_documents.forEach(doc => {
        if (url == doc.document_url) name = doc.document_name
    })
    if (!name && (url.match('https://') || url.match('http://'))) return url
    else return name
}

export {global_documents, getNameForUrl};
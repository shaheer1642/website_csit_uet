import { MakeGETCall } from "../api";
import eventHandler from "../eventHandler"
import { socket } from "../websocket/socket"

var global_documents = []

fetchDocuments()
socket.addEventListener("documents/listener/changed", fetchDocuments);

function fetchDocuments() {
    MakeGETCall('/api/documents')
        .then(res => {
            global_documents = res
        }).catch(console.error)
}

function getNameForUrl(url) {
    var name = ''
    global_documents.forEach(doc => {
        if (url == doc.document_url) name = doc.document_name
    })
    if (!name && (url.match('https://') || url.match('http://'))) return url
    else return name
}

export { global_documents, getNameForUrl };
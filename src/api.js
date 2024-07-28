/**
 * Makes a GET call to the specified endpoint.
 *
 * @param {string} endpoint - The endpoint URL to make the GET request to.
 * @param {Object} options - Options for making the GET call.
 * @param {object} options.query - The request params data.
 * @param {boolean} options.authorized - Whether the request should be authorized.
 * @returns {Promise<any>} A Promise that resolves with the response data or rejects with an error.
 */
function MakeGETCall(endpoint, { query = {}, authorized = false } = {}) {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}${endpoint}${query ? `?${new URLSearchParams(query).toString()}` : ''}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(async res => {
            const contentType = res.headers.get('content-type')
            if (contentType.startsWith('text/html') || contentType.startsWith('text/plain'))
                res.ok ? resolve({ message: await res.text() }) : reject({ message: `Error ${res.status}: ${await res.text()}`, code: res.status })
            if (contentType.startsWith('application/json'))
                res.ok ? resolve(await res.json()) : reject(await res.json())
        }).catch(reject)
    })
}

/**
 * Makes a POST call to the specified endpoint.
 *
 * @param {string} endpoint - The endpoint URL to make the POST request to.
 * @param {Object} options - Options for making the POST call.
 * @param {object} options.body - The request body data.
 * @param {boolean} options.authorized - Whether the request should be authorized.
 * @returns {Promise<any>} A Promise that resolves with the response data or rejects with an error.
 */
function MakePOSTCall(endpoint, { body = {}, authorized = false } = {}) {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            body: (body && JSON.stringify(body))
        }).then(async res => {
            const contentType = res.headers.get('content-type')
            if (contentType.startsWith('text/html') || contentType.startsWith('text/plain'))
                res.ok ? resolve({ message: await res.text() }) : reject({ message: `Error ${res.status}: ${await res.text()}`, code: res.status })
            if (contentType.startsWith('application/json'))
                res.ok ? resolve(await res.json()) : reject(await res.json())
        }).catch(reject)
    })
}

/**
 * Makes a PATCH call to the specified endpoint.
 *
 * @param {string} endpoint - The endpoint URL to make the PATCH request to.
 * @param {Object} options - Options for making the PATCH call.
 * @param {object} options.body - The request body data.
 * @param {boolean} options.authorized - Whether the request should be authorized.
 * @returns {Promise<any>} A Promise that resolves with the response data or rejects with an error.
 */
function MakePATCHCall(endpoint, { body = {}, authorized = false } = {}) {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            body: (body && JSON.stringify(body))
        }).then(async res => {
            const contentType = res.headers.get('content-type')
            if (contentType.startsWith('text/html') || contentType.startsWith('text/plain'))
                res.ok ? resolve({ message: await res.text() }) : reject({ message: `Error ${res.status}: ${await res.text()}`, code: res.status })
            if (contentType.startsWith('application/json'))
                res.ok ? resolve(await res.json()) : reject(await res.json())
        }).catch(reject)
    })
}

/**
 * Makes a DELETE call to the specified endpoint.
 *
 * @param {string} endpoint - The endpoint URL to make the DELETE request to.
 * @param {Object} options - Options for making the DELETE call.
 * @param {object} options.body - The request params data.
 * @param {boolean} options.authorized - Whether the request should be authorized.
 * @returns {Promise<any>} A Promise that resolves with the response data or rejects with an error.
 */
function MakeDELETECall(endpoint, { body = {}, authorized = false } = {}) {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            body: (body && JSON.stringify(body))
        }).then(async res => {
            const contentType = res.headers.get('content-type')
            if (contentType.startsWith('text/html') || contentType.startsWith('text/plain'))
                res.ok ? resolve({ message: await res.text() }) : reject({ message: `Error ${res.status}: ${await res.text()}`, code: res.status })
            if (contentType.startsWith('application/json'))
                res.ok ? resolve(await res.json()) : reject(await res.json())
        }).catch(reject)
    })
}

export {
    MakeGETCall, MakePOSTCall, MakePATCHCall, MakeDELETECall
}
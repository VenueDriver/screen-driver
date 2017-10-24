'use strict';

const net = require('electron').net;

class HttpClient {

    static get(url) {
        return httpRequest('GET', url);
    }

    static post(url, data) {
        return httpRequest('POST', url, data);
    }


}

function httpRequest(method, url, data) {
    let requestOptions = {
        method: method,
        url: url,
    };

    let request = net.request(requestOptions);
    if (!!data) {
        request.write(JSON.stringify(data));
    }
    return generatePromise(request);
}

function generatePromise(request) {
    return new Promise((resolve, reject) => performRequest(request, resolve, reject));
}

function performRequest(request, resolve, reject) {
    request.on('response', response => {
        response.on('data', data => {
            resolve(data.toString('utf8'))
        });
        response.on('error', error => {
            reject(error)
        })
    });
    request.on('error', (error) => {
        reject(error)
    });
    request.end();
}

module.exports = HttpClient;

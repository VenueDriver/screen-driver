'use strict';

const {net} = require('electron');

class HttpClient {

    static get(url) {
        return httpRequest('GET', url);
    }

    static post(url) {
        return httpRequest('POST', url);
    }


}

function httpRequest(method, url) {
    let request = net.request({
        method: method,
        url: url
    });

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

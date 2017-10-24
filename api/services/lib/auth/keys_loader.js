'use strict';

const _ = require('lodash');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const USER_POOL_ID = process.env.USER_POOL_ID;
const REGION = process.env.REGION;

module.exports.loadKeySet = () => {
    let requestParams = buildDownloadKeysParams();
    return new Promise((resolve, reject) => {
        request(requestParams, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(getPems(body));
            } else {
                reject(error);
            }
        });
    });
};

function buildDownloadKeysParams() {
    return {
        url: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
        json: true
    }
}

function getPems(body) {
    let keys = body['keys'];
    let pems = {};
    _.each(keys, k => convertKeyToPem(k, pems));
    return pems;
}

function convertKeyToPem(key, pems) {
    let key_id = key.kid;
    let modulus = key.n;
    let exponent = key.e;
    let key_type = key.kty;
    let jwk = {kty: key_type, n: modulus, e: exponent};
    pems[key_id] = jwkToPem(jwk);
}

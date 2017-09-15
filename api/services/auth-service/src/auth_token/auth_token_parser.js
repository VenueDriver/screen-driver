'use strict';

const jwt = require('jsonwebtoken');

module.exports.verifyToken = (token, pem) => {
    return jwt.verify(token, pem, {algorithms: ['RS256']});
};

module.exports.decodeToken = (token) => {
    return jwt.decode(token, {complete: true});
};
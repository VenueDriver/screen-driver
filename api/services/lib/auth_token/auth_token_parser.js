'use strict';

const jwt = require('jsonwebtoken');

module.exports.verifyToken = (token, pem) => {
    return jwt.verify(token, pem, {algorithms: ['RS256']});
};

module.exports.decodeToken = (token) => {
    return jwt.decode(token, {complete: true});
};

module.exports.getCurrentUserDetails = (request) => {
    let authToken = request.headers['Authorization'];
    let token = authToken.replace('Bearer ', '');
    let decodedToken = this.decodeToken(token);
    return {
        id: decodedToken.payload['sub'],
        email: decodedToken.payload['email'],
        isAdmin: decodedToken.payload['custom:admin']
    };
};

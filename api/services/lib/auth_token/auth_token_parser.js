'use strict';

const jwt = require('jsonwebtoken');

module.exports.verifyToken = (token, pem) => {
    return jwt.verify(token, pem, {algorithms: ['RS256']});
};

module.exports.decodeToken = (token) => {
    return jwt.decode(token, {complete: true});
};

module.exports.getCurrentUserDetails = (token) => {
    let token = token.replace('Bearer ', '');
    let decodedToken = this.decodeToken(token);
    return new User({
        email: decodedToken.payload['email'],
        isAdmin: decodedToken.payload['custom:admin']
    });
};
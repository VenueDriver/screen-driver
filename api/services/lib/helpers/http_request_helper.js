'use strict';

module.exports.getAuthorizationToken = (request) => {
    return request.headers['Authorization'];
};
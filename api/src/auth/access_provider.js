'use strict';

const _ = require('lodash');

const ADMIN_ONLY_ACCESS = [
    'GET/api/users',
    'PUT/api/users',
    'POST/api/users',
];

module.exports.hasAccessToResource = (decodedToken, resourceArn) => {
    let isAdmin = decodedToken.payload['custom:admin'];
    if (!_.isEmpty(requireAdminRights(resourceArn)) && !isAdmin) {
        throw new Error('Access denied');
    }
};

function requireAdminRights(methodArn) {
    return _.find(ADMIN_ONLY_ACCESS, uri => methodArn.includes(uri));
}
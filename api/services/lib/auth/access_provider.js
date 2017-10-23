'use strict';

const _ = require('lodash');

const URIS_REQUIRED_ADMIN_ACCESS = [
    '/api/auth/users'
];

module.exports.hasAccessToResource = (decodedToken, resourceArn) => {
    let isAdmin = decodedToken.payload['custom:admin'];
    if (!_.isEmpty(requireAdminRights(resourceArn)) && !_.isEqual(isAdmin, 'true')) {
        throw new Error('Access denied');
    }
};

function requireAdminRights(methodArn) {
    return _.find(URIS_REQUIRED_ADMIN_ACCESS, uri => methodArn.includes(uri));
}

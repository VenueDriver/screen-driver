'use strict';
let User = require('./entities/user');
const TokenParser = require('../auth_token/auth_token_parser');

const dynamodb = require('../dynamodb/dynamodb');
const responseHelper = require('../helpers/http_response_helper');
const _ = require('lodash');

module.exports.update = (event, context, callback) => {
    let token = event.headers.authorization.replace('Bearer ', '');
    let decodedToken = TokenParser.decodeToken(token);
    let currentUser = new User({
        email: decodedToken.payload['email'],
        isAdmin: decodedToken.payload['custom:admin']
    });

    const data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    let user = new User(data, dynamodb);

    user.update(currentUser)
        .then(updatedUser => {
            callback(null, responseHelper.createSuccessfulResponse(updatedUser));
        })
        .fail(errorMessage => {
            callback(null, responseHelper.createResponseWithError(500, errorMessage));
        });
};

'use strict';

const _ = require('lodash');

const DbHelper = require('../../helpers/db_helper');
const ParametersBuilder = require('./parameters_builder');
const User = require('../entities/user');

module.exports.saveNewCognitoUser = (cognitoUser, user) => {
    let subAttribute = cognitoUser.Attributes.find(attribute => attribute.Name === 'sub');
    user.id = subAttribute.Value;
    return putIntoTable(user);
};

module.exports.saveExistentCognitoUser = (cognitoUser) => {
    let user = convertCognitoUserToPlainUser(cognitoUser);
    return putIntoTable(user);
};

function convertCognitoUserToPlainUser(cognitoUser) {
    let userAttributes = {};
    _.each(cognitoUser.UserAttributes, a => userAttributes[a.Name] = a.Value);
    return new User({
        id: userAttributes.sub,
        username: cognitoUser.Username,
        email: userAttributes.email,
        isAdmin: userAttributes['custom:admin'],
        enabled: true
    });
}

function putIntoTable(user) {
    const params = ParametersBuilder.buildCreateRequestParameters(user);
    return DbHelper.putItem(params);
}

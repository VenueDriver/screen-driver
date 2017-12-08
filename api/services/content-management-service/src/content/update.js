'use strict';

const Q = require('q');
const dynamoDb = require('../dynamodb/dynamodb');
const responseHelper = require('lib/helpers/http_response_helper');
const validator = require('./content_validator');

const DbHelper = require('../helpers/db_helper');

module.exports.update = (event, context, callback) => {
    let data = JSON.parse(event.body);
    data.id = event.pathParameters.id;
    performValidation(data)
        .then(() => checkExisting(data))
        .then(() => updateContent(data))
        .then(response => callback(null, responseHelper.createSuccessfulResponse(response)))
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};

function performValidation(content) {
    return validator.validate(content);
}

function checkExisting(contentForUpdate) {
    let deferred = Q.defer();
    getAllExistingShortNamesBesidesCurrent(contentForUpdate).then((shortNames) => {
        if (shortNames.includes(contentForUpdate.short_name)) {
            deferred.reject('Content with such name already exists');
        }
        deferred.resolve();
    });
    return deferred.promise;
}

function getAllExistingShortNamesBesidesCurrent(contentForUpdate) {
    let deferred = Q.defer();
    let params = {TableName: process.env.CONTENT_TABLE};
    dynamoDb.scan(params, (error, data) => {
        let shortNames = data.Items
            .filter(content => content.id !== contentForUpdate.id)
            .map(content => content.short_name);
        deferred.resolve(shortNames);
    });
    return deferred.promise;
}

function updateContent(content) {
    let params = initParamsForUpdating(content);
    return DbHelper.updateItem(params);
}

function initParamsForUpdating(contentForUpdate) {
    return {
        TableName: process.env.CONTENT_TABLE,
        Key: {
            id: contentForUpdate.id
        },
        ConditionExpression: "#id = :id",
        UpdateExpression: "SET #short_name = :short_name, #url = :url",
        ExpressionAttributeNames: {
            "#id": "id",
            "#short_name": "short_name",
            "#url": "url"
        },
        ExpressionAttributeValues: {
            ":id": contentForUpdate.id,
            ":short_name": contentForUpdate.short_name.trim(),
            ":url": contentForUpdate.url.trim()
        },
        ReturnValues: "ALL_NEW"
    }
}

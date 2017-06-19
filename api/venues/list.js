'use strict';

const Q = require('q');
const dynamoDb = require('./../dynamodb');

module.exports.list = (event, context, callback) => {
    let venues;
    let content;
    getAllVenues().then(result => {
        venues = result;
        return getAllContent();
    }).then(result => {
        content = result;
        mergeVenuesWithContent(venues, content);
        const response = {
            statusCode: 200,
            body: JSON.stringify(venues),
        };
        callback(null, response);
    });
};

function getAllVenues() {
    let deferred = Q.defer();
    dynamoDb.scan({TableName: process.env.VENUES_TABLE}, (error, result) => {
        if (error) {
            deferred.reject('Couldn\'t fetch the venues.');
        }
        deferred.resolve(result.Items);
    });
    return deferred.promise;
}

function getAllContent() {
    let deferred = Q.defer();
    dynamoDb.scan({TableName: process.env.CONTENT_TABLE}, (error, result) => {
        if (error) {
            deferred.reject('Couldn\'t fetch the content.');
        }
        deferred.resolve(result.Items);
    });
    return deferred.promise;
}

function mergeVenuesWithContent(venues, content) {
    mergeByContentId(venues, content);
}

function mergeByContentId(items, contentList) {
    items.forEach(item => {
        if (item.content_id) {
            let content = findContentById(item, contentList);
            addContentValuesToItem(item, content);
        }
        mergeContentWithChild(item, contentList);
    })
}

function findContentById(item, contentList) {
    return contentList.filter(c => c.id === item.content_id);
}

function addContentValuesToItem(item, content) {
    if (content) {
        item.content = content;
        delete item.content_id;
    }
}

function mergeContentWithChild(item, contentList) {
    if (item['screen_groups']) {
        mergeByContentId(item.screen_groups, contentList);
    }
    if (item['screens']) {
        mergeByContentId(item.screens, contentList);
    }
}

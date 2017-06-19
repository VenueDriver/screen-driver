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
    findContent(venues, content);
}

function findContent(items, contentList) {
    items.forEach(item => {
        if (item.content_id) {
            let content = contentList.find(c => c.id === item.content_id);
            if (content) {
                item.contentShortName = content.short_name;
                item.contentUrl = content.url;
            } else {
                delete item.content_id;
            }
        }
        if (item.screen_groups) {
            findContent(item.screen_groups, contentList);
        } else if (item.screens) {
            findContent(item.screens, contentList);
        }
    })
}

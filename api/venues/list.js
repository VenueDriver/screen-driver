'use strict';

const dbHelper = require('./../helpers/db_helper');
const responseHelper = require('../helpers/http_response_helper');

module.exports.list = (event, context, callback) => {
    let venues;
    let content;
    findAllVenues()
        .then(result => {
            venues = result;
            return findAllContent();
        })
        .then(result => {
            content = result;
            mergeWithContent(venues, content);
            callback(null, responseHelper.createSuccessfulResponse(venues));
        })
        .fail(error => callback(null, responseHelper.createResponseWithError(500, error)));
};

function findAllVenues() {
    return dbHelper.findAll(process.env.VENUES_TABLE);
}

function findAllContent() {
    return dbHelper.findAll(process.env.CONTENT_TABLE);
}

function mergeWithContent(items, contentList) {
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
        item.content = content[0];
    }
}

function mergeContentWithChild(item, contentList) {
    if (item['screen_groups']) {
        mergeWithContent(item.screen_groups, contentList);
    }
    if (item['screens']) {
        mergeWithContent(item.screens, contentList);
    }
}

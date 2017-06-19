'use strict';

const dbHelper = require('./../helpers/db_helper');

module.exports.list = (event, context, callback) => {
    let venues;
    let content;
    findAllVenues().then(result => {
        venues = result;
        return findAllContent();
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

function findAllVenues() {
    return dbHelper.findAll(process.env.VENUES_TABLE);
}

function findAllContent() {
    return dbHelper.findAll(process.env.CONTENT_TABLE);
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

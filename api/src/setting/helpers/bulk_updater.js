'use strict';

const ParametersBuilder = require('./parameters_builder');
const db = require('../../dynamodb');
const _ = require('lodash');

module.exports.performBulkUpdate = (settings) => {
    let promiseList = [];
    _.forEach(settings, s => {
        let params = ParametersBuilder.buildUpdateConfigParameters(s);
        let promise = updateSetting(params);
        promiseList.push(promise);
    });
    return Promise.all(promiseList);
};

function updateSetting(params) {
    return new Promise((resolve, reject) => {
        db.update(params, (error) => {
            if (error) {
                reject(error.message);
            } else {
                resolve();
            }
        });
    });
}
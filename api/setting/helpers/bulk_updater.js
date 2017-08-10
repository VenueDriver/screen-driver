const ParametersBuilder = require('./parameters_builder');
const db = require('../../dynamodb');
const _ = require('lodash');

module.exports.performBulkUpdate = (settings) => {
    let promises = [];
    _.forEach(settings, s => {
        let params = ParametersBuilder.buildUpdateConfigParameters(s);
        promises.push(generateUpdatePromise(params));
    });
    return Promise.all(promises);
};

function generateUpdatePromise(params) {
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
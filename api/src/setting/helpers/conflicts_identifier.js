'use strict';

const DbHelper = require('../../helpers/db_helper');

const Q = require('q');
const _ = require('lodash');

module.exports = class ConflictsIdentifier {

    static findConflictsInConfig(setting) {
        let deferred = Q.defer();
        ConflictsIdentifier._getExistingConfigs(setting.priority)
            .then(configs => {
                let conflictedConfigs = ConflictsIdentifier._detectConflictInConfigs(configs, setting);
                deferred.resolve(conflictedConfigs);
            });
        return deferred.promise;
    }

    static _getExistingConfigs(priorityType) {
        let params = ConflictsIdentifier._buildFindConfigsByPriorityRequestParameters(priorityType);
        return DbHelper.findByParams(params);
    }

    static _buildFindConfigsByPriorityRequestParameters(priority) {
        return {
            TableName: process.env.SETTINGS_TABLE,
            ProjectionExpression: 'config',
            ExpressionAttributeValues: {
                ':priority': priority
            },
            FilterExpression: 'priority = :priority'
        };
    }

    static _detectConflictInConfigs(configs, setting) {
        let currentConfig = _.assignIn(...configs, {});
        return _.pickBy(setting.config, (v, k) => currentConfig[k] !== v);
    }
};
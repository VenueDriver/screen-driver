'use strict';

const PriorityTypes = require('../../enums/priority_types');
const DbHelper = require('../../helpers/db_helper');
const SchedulesFinder = require('../../schedule/helpers/schedules_finder');
const ScheduleOverflowInspector = require('../../schedule/helpers/schedule_overflow_inspector');

const Q = require('q');
const _ = require('lodash');

module.exports = class ConflictsIdentifier {

    static findConflicts(setting) {
        switch (setting.priority) {
            case PriorityTypes.getTypeIds()[0]:
                return ConflictsIdentifier.findConflictsInPersistentConfig(setting);
            case PriorityTypes.getTypeIds()[1]:
                return ConflictsIdentifier.findConflictsInPeriodicalConfig(setting);
        }
    }

    static findConflictsInPeriodicalConfig(setting) {
        let deferred = Q.defer();
        let conflictedConfigs = [];
        ConflictsIdentifier._getExistingConfigs(setting.priority)
            .then(configs => {
                conflictedConfigs = ConflictsIdentifier._detectConflictInConfigs(configs, setting);
                let settingIds = ConflictsIdentifier._getSettingIdsArray(conflictedConfigs);
                return SchedulesFinder.findAllBySettingIds(settingIds);
            })
            .then(schedules => {
                let schedulesForCurrentSetting = SchedulesFinder.findAllByOneSettingId(setting.id);
                let overflow = ScheduleOverflowInspector.findOverflow(schedules, schedulesForCurrentSetting);
                let settingsOverflow = _.map(overflow, o => o.settingId);
                let conflicts = _.filter(conflictedConfigs, c => settingsOverflow.includes(c.id));
                deferred.resolve(conflicts);
            });
        return deferred.promise;
    }

    static findConflictsInPersistentConfig(setting) {
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
            ProjectionExpression: 'id, config',
            ExpressionAttributeValues: {
                ':priority': priority
            },
            FilterExpression: 'priority = :priority'
        };
    }

    static _detectConflictInConfigs(existingSettings, setting) {
        let conflicts = [];
        _.each(setting.config, (v, k) => {
            _.each(existingSettings, s => {
                if (!_.isEmpty(s.config[k]) && s.config[k] !== v) {
                    conflicts.push({settingId: s.id, config: s.config});
                }
            });
        });
        return conflicts;
    }

    static _getSettingIdsArray(settings) {
        return _.map(settings, s => s.id);
    }
};
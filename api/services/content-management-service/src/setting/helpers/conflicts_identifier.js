'use strict';

const PriorityTypes = require('../../enums/priority_types');
const DbHelper = require('../../helpers/db_helper');
const SchedulesFinder = require('../../schedule/helpers/schedules_finder');
const ScheduleOverlapInspector = require('../../schedule/helpers/schedule_overlap_inspector');

const Q = require('q');
const _ = require('lodash');

module.exports = class ConflictsIdentifier {

    static findConflicts(setting, schedules) {
        if (!setting.enabled) {
            return new Promise((resolve, reject) => resolve([]));
        }
        switch (setting.priority) {
            case PriorityTypes.getTypeIds()[0]:
                return ConflictsIdentifier.findConflictsInPersistentConfig(setting);
            case PriorityTypes.getTypeIds()[1]:
            case PriorityTypes.getTypeIds()[2]:
                return ConflictsIdentifier.findConflictsInScheduledConfig(setting, schedules);
        }
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

    static findConflictsInScheduledConfig(setting, schedules) {
        let deferred = Q.defer();
        let conflictedConfigs = [];
        let existingSchedules = [];
        ConflictsIdentifier._getExistingConfigs(setting.priority)
            .then(configs => {
                conflictedConfigs = ConflictsIdentifier._detectConflictInConfigs(configs, setting);
                let settingIds = ConflictsIdentifier._getSettingIdsArray(conflictedConfigs);
                return SchedulesFinder.findAllEnabledBySettingIds(settingIds);
            })
            .then(schedules => {
                existingSchedules = schedules;
                return SchedulesFinder.findAllEnabledByOneSettingId(setting.id)
            })
            .then(schedulesForCurrentSetting => {
                let overlap = ScheduleOverlapInspector
                    .findOverlap(existingSchedules, _.isEmpty(schedules) ? schedulesForCurrentSetting : schedules);
                let settingsOverlap = _.map(overlap, o => o.settingId);
                let conflicts = _.filter(conflictedConfigs, c => _.includes(settingsOverlap, c.settingId));
                deferred.resolve(conflicts);
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
                ':priority': priority,
                ':enabled': true
            },
            FilterExpression: 'priority = :priority AND enabled = :enabled'
        };
    }

    static _detectConflictInConfigs(existingSettings, setting) {
        let conflicts = [];
        existingSettings = _.filter(existingSettings, s => s.id !== setting.id);
        _.each(setting.config, (contentId, venueItemId) => {
            _.each(existingSettings, setting => {
                if (!_.isEmpty(setting.config[venueItemId]) && setting.config[venueItemId] !== contentId) {
                    conflicts.push({settingId: setting.id, config: setting.config});
                }
            });
        });
        return conflicts;
    }

    static _getSettingIdsArray(conflicts) {
        return _.map(conflicts, s => s.settingId);
    }
};
'use strict';

module.exports.buildPutRequestParameters = (screenUpdateSchedule) => {
    return {
        TableName: process.env.SCREENS_UPDATE_SCHEDULES_TABLE,
        Item:{
            id: screenUpdateSchedule.id,
            eventTime: screenUpdateSchedule.eventTime,
            isEnabled: screenUpdateSchedule.isEnabled
        }
    };
};

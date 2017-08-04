import * as _ from 'lodash';

export const ScheduleTypes = {
    ONE_TIME_EVENT: 'One time event',
    WEEKLY: 'Weekly'
};

export const ScheduleTypeKeys = Object.keys(ScheduleTypes);

export const getScheduleTypeValues = () => {
    return _.map(ScheduleTypes, t => t);
};
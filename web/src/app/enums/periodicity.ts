import * as _ from 'lodash';

export const Periodicity = {
    ONE_TIME_EVENT: 'One time event',
    WEEKLY: 'Weekly'
};

export const getPropertyName = (value: string) => {
    return _.keys(Periodicity).filter(k => Periodicity[k] === value)[0];
};
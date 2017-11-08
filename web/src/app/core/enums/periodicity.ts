import * as _ from 'lodash';

export const Periodicity = {
    ONE_TIME: 'One time',
    REPEATABLE: 'Repeatable'
};

export const getPropertyName = (value: string) => {
    return _.keys(Periodicity).filter(k => Periodicity[k] === value)[0];
};

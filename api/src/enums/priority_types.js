'use strict';

class PriorityTypes {
    static getTypes() {
        return isTestMode() ? getTestTypes() : getTypes();
    }
}

function getTestTypes() {
    return [
        {id: 'test_id_1', name: 'test_type_1'},
        {id: 'test_id_2', name: 'test_type_2'},
        {id: 'test_id_3', name: 'test_type_2'}
    ]
}

function getTypes() {
    return [
        {id: 'ef48d7d3', name: 'Persistent'},
        {id: '1d7c6369', name: 'Periodical'},
        {id: '9a0a758a', name: 'Occasional'}
    ]
}

function isTestMode() {
    return process.env.STAGE == 'test';
}

module.exports = PriorityTypes;

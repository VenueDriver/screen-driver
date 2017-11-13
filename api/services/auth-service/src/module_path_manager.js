'use strict';

module.exports.getBasePath = () => {
    let stage = process.env.STAGE;
    return process.env.IS_OFFLINE || stage === 'test' ? '../../../' : '../../';
};

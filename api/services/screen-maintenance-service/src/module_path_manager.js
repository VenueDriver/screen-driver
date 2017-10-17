'use strict';

module.exports.getBasePath = () => {
    let stage = process.env.STAGE;
    return stage === 'dev' || stage === 'test' ? '../../../' : '../../';
};

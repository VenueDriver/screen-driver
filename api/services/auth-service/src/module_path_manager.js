'use strict';

module.exports.getBasePath = () => {
    return process.env.STAGE === 'test' ? '../../../' : '../../';
};
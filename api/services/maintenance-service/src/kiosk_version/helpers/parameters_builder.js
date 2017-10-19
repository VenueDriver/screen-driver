'use strict';

module.exports.buildPutRequestParameters = (screenId, version) => {
    return {
        TableName: process.env.SCREENS_VERSIONS_TABLE,
        Item:{
            screenId: screenId,
            version: version,
            updatedAt: new Date()
        }
    };
};

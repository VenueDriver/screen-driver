'use strict';

module.exports.buildPutRequestParameters = (versionDetails) => {
    return {
        TableName: process.env.SCREENS_VERSIONS_TABLE,
        Item: {
            screenId: versionDetails.screenId,
            version: versionDetails.version,
            updatedAt: versionDetails.updatedAt
        }
    };
};

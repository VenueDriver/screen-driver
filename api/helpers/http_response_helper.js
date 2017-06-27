'use strict';

module.exports.createSuccessfulResponse = (params) => {
    return {
        statusCode: 200,
        body: params
    };
};

module.exports.createResponseWithError = (statusCode, error) => {
    return {
        statusCode: statusCode,
        body: {message: error}
    };
};

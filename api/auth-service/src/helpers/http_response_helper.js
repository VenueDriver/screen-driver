'use strict';

const headers = {
    "Access-Control-Allow-Origin" : "*"
};

module.exports.createSuccessfulResponse = (params) => {
    return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(params)
    };
};

module.exports.createResponseWithError = (statusCode, error) => {
    return {
        statusCode: statusCode,
        headers: headers,
        body: JSON.stringify({message: error})
    };
};

module.exports.createResponse = (statusCode, params) => {
    return {
        statusCode: statusCode,
        headers: headers,
        body: JSON.stringify(params)
    };
};

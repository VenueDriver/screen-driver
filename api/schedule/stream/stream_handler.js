'use strict';

const FunctionInvokeHelper = require('../../helpers/function_invoke_helper');

module.exports.handleEvent = (event, context) => {
    let params = buildParamsForInvokeFunction(context);
    FunctionInvokeHelper.invokeFunction(params, context);
};

function buildParamsForInvokeFunction(context) {
    let functionName = context.functionName;
    let functionNameSuffix = functionName.substring(0, functionName.lastIndexOf('-') + 1);
    return {
        FunctionName: `${functionNameSuffix}push_schedules_update`,
        InvocationType: 'RequestResponse'
    };
}

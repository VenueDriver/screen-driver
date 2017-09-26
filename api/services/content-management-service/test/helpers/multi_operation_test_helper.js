const Q = require('q');
const mochaPlugin = require('serverless-mocha-plugin');
const lambdaWrapper = mochaPlugin.lambdaWrapper;

class MultiOperationHelper {
    constructor() {

    }

    static configure() {
        let helper = new this();
        this.wrappedGetAll = {};
        this.wrappedCreate = {};
        this.wrappedUpdate = {};
        return helper;
    }

    setGetAllFunction(getAllFunction, handler) {
        this.wrappedGetAll = this.wrapFunction(getAllFunction, handler);
        return this;
    }

    setCreateFunction(createFunction, handler) {
        this.wrappedCreate = this.wrapFunction(createFunction, handler);
        return this;
    }

    setUpdateFunction(updateFunction, handler) {
        this.wrappedUpdate = this.wrapFunction(updateFunction, handler);
        return this;
    }

    wrapFunction(sourceFunction, handler) {
        return lambdaWrapper.wrap(sourceFunction, {handler: handler});
    }

    create(items) {
        if (Array.isArray(items)) {
            return Q.all(items.map(item => this.create(item)));
        }

        let itemParams = {body: JSON.stringify(items)};
        return this.wrappedCreate.run(itemParams);
    }

    update(response, updatedItem) {
        return this.wrappedUpdate.run(this.getParameters(updatedItem, response));
    }

    getAll() {
        return this.wrappedGetAll.run({});
    }

    test(response, expectations) {
        let body = JSON.parse(response.body);
        return expectations(body, response);
    }

    performCreateTest(item, expectation) {
        return this.create(item)
            .then(response => this.test(response, expectation))
    }

    performListTest(item, expectations) {
        return this.create(item)
            .then(() => this.getAll())
            .then(response => this.test(response, expectations))
    }

    performUpdateTest(item, updatedItem, expectation) {
        return this.create(item)
            .then(response => this.update(response, updatedItem))
            .then(response => this.test(response, expectation))
    }

    getParameters(item, response) {
        let params = {};
        if (response) {
            let responseBody = JSON.parse(response.body);
            let id = responseBody.id;
            if (responseBody.screen_groups) {
                _setIdsForChildElements(responseBody);
            }
            params.pathParameters = {};
            params.pathParameters.id = id;
        }
        params.body = JSON.stringify(item);
        return params;

        function _addId(sourceElement, sourceField, destinationElement) {
            destinationElement.id = sourceElement[sourceField].map(element => element.name == destinationElement.name)[0].id;
        }

        function _setIdsForChildElements(responseBody) {
            responseBody.screen_groups.forEach(group => {
                _addId(item, 'screen_groups', group);
                group.screens.forEach(screen => _addId(group, 'screens', screen))
            });
        }
    }

}

module.exports = MultiOperationHelper;

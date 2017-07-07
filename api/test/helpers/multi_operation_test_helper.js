const Q = require('q');
const mochaPlugin = require('serverless-mocha-plugin');
const lambdaWrapper = mochaPlugin.lambdaWrapper;

class MultiOperationHelper {
    constructor() {

    }

    configure() {
        this.wrappedGetAll = {};
        this.wrappedCreate = {};
        this.wrappedUpdate = {};
        return this;
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

    wrapFunction(getAllFunction, handler) {
        return lambdaWrapper.wrap(getAllFunction, {handler: handler});
    }

    create(items) {
        if (Array.isArray(items)) {
            return Q.all(items.map(item => this.create(item)));
        }

        let itemParams = {body: JSON.stringify(items)};
        return this.wrappedCreate.run(itemParams);
    }

    getAll() {
        return this.wrappedGetAll.run({});
    }

    performListTest(item, expectation) {
        return this.create(item)
            .then(() => this.getAll())
            .then(response => {
                let body = JSON.parse(response.body);
                return expectation(body);
            })
    }

}

module.exports = new MultiOperationHelper();

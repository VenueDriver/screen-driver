'use strict';

// tests for content_list
// Generated by serverless-mocha-plugin
require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const getAllFunction = require('../content/list.js');
const createFunction = require('../content/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;
const wrappedGetAll = lambdaWrapper.wrap(getAllFunction, {handler: 'list'});
const wrappedCreate = lambdaWrapper.wrap(createFunction, {handler: 'create'});


describe('content_list', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });


    it('Should display empty list', () => {
        wrappedGetAll.run({}).then(response => {
            let body = JSON.parse(response.body);
            expect(body).is.an('array').that.is.empty;
        })
    });

    it('Should display list with 2 contents', () => {
        let firstContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let secondContent = {short_name: 'Hakkasan LV', url: 'http://example.com'};

        let expectations = (response) => {
            let body = JSON.parse(response.body);
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body).is.an('array').that.lengthOf(2);
        };

        return createContent(firstContent)
            .then(() => createContent(secondContent))
            .then(() => wrappedGetAll.run({}))
            .then(expectations)
    });

    it('Should display short name', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};

        let expectations = (response) => {
            let body = JSON.parse(response.body);
            expect(body[0]).to.have.property('short_name').that.equal('Hakkasan');
        };

        return createContent(content)
            .then(() => wrappedGetAll.run({}))
            .then(expectations)
    });

    it('Should display url', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};

        let expectations = (response) => {
            let body = JSON.parse(response.body);
            expect(body[0]).to.have.property('url').that.equal('http://example.com');
        };

        return createContent(content)
            .then(() => wrappedGetAll.run({}))
            .then(expectations)
    });
});


function createContent(content) {
    return wrappedCreate.run(getParametersFor(content));
}

function getParametersFor(content) {
    let params = {};
    params.body = JSON.stringify(content);
    return params;
}
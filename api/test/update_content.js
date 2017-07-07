'use strict';

// tests for update_content
// Generated by serverless-mocha-plugin
require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');


const updateFunction = require('../content/update.js');
const createFunction = require('../content/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;
const wrappedUpdate = lambdaWrapper.wrap(updateFunction, {handler: 'update'});
const wrappedCreate = lambdaWrapper.wrap(createFunction, {handler: 'create'});

describe('update_content', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    it('Should update short name', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {short_name: 'Hakkasan LV', url: 'http://example.com'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body).to.have.property('short_name').that.equal('Hakkasan LV');
            expect(body).to.have.property('url').that.equal('http://example.com');
        };

        return createUpdateAndTest(newContent, updatedContent, expectations);
    });

    it('Should update url', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {short_name: 'Hakkasan', url: 'http://example.us.com'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body).to.have.property('short_name').that.equal('Hakkasan');
            expect(body).to.have.property('url').that.equal('http://example.us.com');
        };

        return createUpdateAndTest(newContent, updatedContent, expectations);
    });

    it('Shouldn\'t update content without short name', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {url: 'http://example.us.com'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return createUpdateAndTest(newContent, updatedContent, expectations);
    });

    it('Shouldn\'t update content without url', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {short_name: 'Hakkasan'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return createUpdateAndTest(newContent, updatedContent, expectations);
    });

    it('Shouldn\'t update content with empty short name', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {short_name: '', url: 'http://example.us.com'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return createUpdateAndTest(newContent, updatedContent, expectations);
    });

    it('Shouldn\'t update content with empty url', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {short_name: 'Hakkasan', url: ''};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return createUpdateAndTest(newContent, updatedContent, expectations);
    });
});

function createContent(params) {
    return wrappedCreate.run(params);
}

function createUpdateAndTest(newContent, updatedContent, expectations) {
    return createContent(getParametersFor(newContent))
        .then((response) => {
            return wrappedUpdate.run(getParametersFor(updatedContent, response))
        })
        .then(response => {
            let body = JSON.parse(response.body);
            expectations(body, response);
        });
}

function getParametersFor(content, response) {
    let params = {};
    if (response) {
        let responseBody = JSON.parse(response.body);
        let id = responseBody.id;
        params.pathParameters = {};
        params.pathParameters.id = id;
    }
    params.body = JSON.stringify(content);
    return params;
}
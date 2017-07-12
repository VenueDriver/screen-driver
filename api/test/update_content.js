'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');


const updateFunction = require('../content/update.js');
const createFunction = require('../content/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setUpdateFunction(updateFunction, 'update')
    .setCreateFunction(createFunction, 'create');

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

        return MultiOperationHelper.performUpdateTest(newContent, updatedContent, expectations);
    });

    it('Should update url', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {short_name: 'Hakkasan', url: 'http://example.us.com'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body).to.have.property('short_name').that.equal('Hakkasan');
            expect(body).to.have.property('url').that.equal('http://example.us.com');
        };

        return MultiOperationHelper.performUpdateTest(newContent, updatedContent, expectations);
    });

    it('Shouldn\'t update content without short name', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {url: 'http://example.us.com'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return MultiOperationHelper.performUpdateTest(newContent, updatedContent, expectations);
    });

    it('Shouldn\'t update content without url', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {short_name: 'Hakkasan'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return MultiOperationHelper.performUpdateTest(newContent, updatedContent, expectations);
    });

    it('Shouldn\'t update content with empty short name', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {short_name: '', url: 'http://example.us.com'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return MultiOperationHelper.performUpdateTest(newContent, updatedContent, expectations);
    });

    it('Shouldn\'t update content with empty url', () => {
        let newContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let updatedContent = {short_name: 'Hakkasan', url: ''};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return MultiOperationHelper.performUpdateTest(newContent, updatedContent, expectations);
    });
});
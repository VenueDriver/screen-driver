'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const getAllFunction = require('../src/content/list.js');
const createFunction = require('../src/content/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setGetAllFunction(getAllFunction, 'list')
    .setCreateFunction(createFunction, 'create');


describe('content_list', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });


    it('Should display empty list', () => {
        let expectations = (body) => {
            expect(body).is.an('array').that.is.empty;
        };

        return MultiOperationHelper.performListTest({}, expectations);
    });

    it('Should display list with 2 contents', () => {
        let firstContent = {short_name: 'Hakkasan', url: 'http://example.com'};
        let secondContent = {short_name: 'Hakkasan LV', url: 'http://example.com'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body).is.an('array').that.lengthOf(2);
        };

        return MultiOperationHelper.create(firstContent)
            .then(() => MultiOperationHelper.performListTest(secondContent, expectations));
    });

    it('Should display short name', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};

        let expectations = (body) => {
            expect(body[0]).to.have.property('short_name').that.equal('Hakkasan');
        };

        return MultiOperationHelper.performListTest(content, expectations)
    });

    it('Should display url', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};

        let expectations = (body) => {
            expect(body[0]).to.have.property('url').that.equal('http://example.com');
        };

        return MultiOperationHelper.performListTest(content, expectations)
    });
});

'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const createFunction = require('../content/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create');

const idLength = 36;

describe('create_content', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });


    it('Should create content with short name', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};

        let expectations = (body) => {
            expect(body).to.have.property('short_name').that.equal('Hakkasan');
            expect(body).to.have.property('url').that.equal('http://example.com');
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Should create id automatically', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create content without short name', () => {
        let content = {url: 'http://example.com'};

        let expectations = (body, response) => {
            expect(response.statusCode).equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create content with empty short name', () => {
        let content = {short_name: '', url: 'http://example.com'};

        let expectations = (body, response) => {
            expect(response.statusCode).equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create content with non-unique short name', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};

        let expectations = (body, response) => {
            expect(response.statusCode).equal(500);
            expect(body).to.have.property('message').that.equal('Content with such name already exists');
        };

        return MultiOperationHelper.create(content)
            .then(() => MultiOperationHelper.performCreateTest(content, expectations));
    });

    it('Shouldn\'t create content without url', () => {
        let content = {short_name: 'Hakkasan'};

        let expectations = (body, response) => {
            expect(response.statusCode).equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });

    it('Shouldn\'t create content with empty url', () => {
        let content = {short_name: 'Hakkasan', url: ''};

        let expectations = (body, response) => {
            expect(response.statusCode).equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        };

        return MultiOperationHelper.performCreateTest(content, expectations);
    });
});

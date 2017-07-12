'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const createFunction = require('../config/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create');

const idLength = 36;

describe('create_config', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    it('Should create config with name', () => {
        let config = {name: 'New Year'};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('name').that.equal('New Year');
            expect(body).to.have.property('enabled').that.equal(false);
            expect(body).to.have.property('config').to.be.an('object').that.is.empty;
            expect(body).to.have.property('_rev').that.equal(0);
        };

        return MultiOperationHelper.performCreateTest(config, expectations);
    });

    it('Should create enabled config', () => {
        let config = {name: 'New Year', enabled: true};

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(true);
        };

        return MultiOperationHelper.performCreateTest(config, expectations);
    });

    it('Should create disabled config', () => {
        let config = {name: 'New Year', enabled: false};

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(false);
        };

        return MultiOperationHelper.performCreateTest(config, expectations);
    });

    it('Shouldn\'t create config without name', () => {
        let config = {};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Config couldn\'t be without name');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(config, expectations);
    });

    it('Shouldn\'t create config with empty name', () => {
        let config = {};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Config couldn\'t be without name');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(config, expectations);
    });

    it('Shouldn\'t create config with name length 3 or less', () => {
        let config = {name: 'NYP'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Config\'s name should be longer then 3 symbols');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(config, expectations);
    });

    it('Shouldn\'t create config with non-boolean enable field', () => {
        let config = {name: 'New Year', enabled: "string"};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Enabled field should be boolean');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(config, expectations);
    });

    it('Shouldn\'t create config with existing name', () => {
        let config = {name: 'New Year'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Config with such name already exists');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.create(config)
            .then(() => MultiOperationHelper.performCreateTest(config, expectations));
    });

});

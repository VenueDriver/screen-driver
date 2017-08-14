'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const createFunction = require('../src/setting/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create');

const idLength = 36;

describe('create_setting', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    it('Should create setting with name', () => {
        let setting = {name: 'New Year', priority: 'test_id_1'};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('name').that.equal('New Year');
            expect(body).to.have.property('enabled').that.equal(false);
            expect(body).to.have.property('config').to.be.an('object').that.is.empty;
            expect(body).to.have.property('_rev').that.equal(0);
        };

        return MultiOperationHelper.performCreateTest(setting, expectations);
    });

    it('Should create enabled setting', () => {
        let setting = {name: 'New Year', enabled: true, priority: 'test_id_1'};

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(true);
        };

        return MultiOperationHelper.performCreateTest(setting, expectations);
    });

    it('Should create disabled setting', () => {
        let setting = {name: 'New Year', enabled: false, priority: 'test_id_1'};

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(false);
        };

        return MultiOperationHelper.performCreateTest(setting, expectations);
    });

    it('Shouldn\'t create setting without name', () => {
        let setting = {};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Setting couldn\'t be without name');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(setting, expectations);
    });

    it('Shouldn\'t create setting with empty name', () => {
        let setting = {};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Setting couldn\'t be without name');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(setting, expectations);
    });

    it('Shouldn\'t create setting with name length 3 or less', () => {
        let setting = {name: 'NYP'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Setting\'s name should be longer then 3 symbols');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(setting, expectations);
    });

    it('Shouldn\'t create setting with non-boolean enable field', () => {
        let setting = {name: 'New Year', enabled: "string"};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Enabled field should be boolean');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performCreateTest(setting, expectations);
    });

    it('Shouldn\'t create setting with existing name', () => {
        let setting = {name: 'New Year', priority: 'test_id_1'};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Setting with such name already exists');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.create(setting)
            .then(() => MultiOperationHelper.performCreateTest(setting, expectations));
    });

});

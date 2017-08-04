'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const getAllFunction = require('../setting/list.js');
const createFunction = require('../setting/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setGetAllFunction(getAllFunction, 'list')
    .setCreateFunction(createFunction, 'create');

const idLength = 36;

describe('get_settings_list', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });


    it('Should display empty list', () => {
        return MultiOperationHelper.getAll().then((response) => {
            let body = JSON.parse(response.body);
            expect(body.settings).to.be.an('array').that.is.empty;
        });
    });

    it('Should display list with 1 setting', () => {
        let setting = {name: 'New year', priority: 'test_id_1'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body.settings).is.an('array').that.lengthOf(1);
        };

        return MultiOperationHelper.performListTest(setting, expectations);
    });

    it('Should display list with 2 configs', () => {
        let firstSetting = {name: 'New year', priority: 'test_id_1'};
        let secondSetting = {name: 'July 4', priority: 'test_id_1'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body.settings).is.an('array').that.lengthOf(2);
        };

        return MultiOperationHelper.create(firstSetting)
            .then(() => MultiOperationHelper.performListTest(secondSetting, expectations));
    });

    it('Should display all properties', () => {
        let setting = {name: 'July 4', enabled: true, config: {}, priority: 'test_id_1'};

        let expectations = (body) => {
            expect(body.settings[0]).to.have.property('id').with.lengthOf(idLength);
            expect(body.settings[0]).to.have.property('name').that.equal('July 4');
            expect(body.settings[0]).to.have.property('enabled').that.equal(true);
            expect(body.settings[0]).to.have.property('config').to.be.an('object').that.is.empty;
            expect(body.settings[0]).to.have.property('_rev').that.equal(0);
        };

        return MultiOperationHelper.performListTest(setting, expectations)
    });

});

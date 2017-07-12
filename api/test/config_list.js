'use strict';

// tests for config_list
// Generated by serverless-mocha-plugin
require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const getAllFunction = require('../config/list.js');
const createFunction = require('../config/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setGetAllFunction(getAllFunction, 'list')
    .setCreateFunction(createFunction, 'create');

const idLength = 36;

describe('config_list', () => {
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

    it('Should display list with 2 configs', () => {
        let firstConfig = {name: 'New year'};
        let secondConfig = {name: 'July 4'};

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(200);
            expect(body).is.an('array').that.lengthOf(2);
        };

        return MultiOperationHelper.create(firstConfig)
            .then(MultiOperationHelper.performListTest(secondConfig, expectations));
    });

    it('Should display all properties', () => {
        let config = {name: 'July 4', enabled: true, config: {}};

        let expectations = (body) => {
            expect(body[0]).to.have.property('id').with.lengthOf(idLength);
            expect(body[0]).to.have.property('name').that.equal('July 4');
            expect(body[0]).to.have.property('enabled').that.equal(true);
            expect(body[0]).to.have.property('config').to.be.an('object').that.is.empty;
            expect(body[0]).to.have.property('_rev').that.equal(0);
        };

        return MultiOperationHelper.performListTest(config, expectations)
    });

});

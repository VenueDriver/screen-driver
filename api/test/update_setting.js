'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const createFunction = require('../src/setting/create');
const updateFunction = require('../src/setting/update');
const mochaPlugin = require('serverless-mocha-plugin');

const PriorityTypes = require('../src/enums/priority_types');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create')
    .setUpdateFunction(updateFunction, 'update');

const idLength = 36;

describe('update_setting', () => {

    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    it('Should update the name and increase revision', () => {
        let newSetting = {name: 'New Year Party', priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', _rev: 0, priority: 'test_id_1'};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('name').that.equal('New Year');
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Should enable configuration', () => {
        let newSetting = {name: 'New Year Party', enabled: false, priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', enabled: true, _rev: 0, priority: 'test_id_1'};

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(true);
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Should update setting with new config', () => {
        let config = {screen_id: 'content_id'};
        let newSetting = {name: 'New Year', enabled: true, priority: PriorityTypes.getTypeIds()[0], config: config};
        let updatedConfig = {screen_id: 'content_id_2'};
        let updatedSetting = {name: 'New Year', enabled: true, _rev: 0, priority: PriorityTypes.getTypeIds()[0], config: updatedConfig};

        let expectations = (body) => {
            expect(body).to.have.property('config').that.to.deep.equal(updatedConfig);
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting without name', () => {
        let newSetting = {name: 'New Year'};
        let updatedSetting = {_rev: 0};

        let expectations = generateErrorExpectations('Setting couldn\'t be without name', 500);

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting with empty name', () => {
        let newSetting = {name: 'New Year'};
        let updatedSetting = {name: '', _rev: 0};

        let expectations = generateErrorExpectations('Setting couldn\'t be without name', 500);

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting with name length 3 or less', () => {
        let newSetting = {name: 'New Year'};
        let updatedSetting = {name: 'NYP', _rev: 0};

        let expectations = generateErrorExpectations('Setting\'s name should be longer then 3 symbols', 500);

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting with non-boolean enable field', () => {
        let newSetting = {name: 'New Year'};
        let updatedSetting = {name: 'New Year', enabled: 'string', _rev: 0};

        let expectations = generateErrorExpectations('Enabled field should be boolean', 500);

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting with existing name', () => {
        let existingSetting = {name: 'New Year', priority: 'test_id_1'};
        let newSetting = {name: 'New Year Party', priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', _rev: 0, priority: 'test_id_1'};

        let expectations = generateErrorExpectations('Setting with such name already exists', 500);

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

});

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}

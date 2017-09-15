'use strict';

require('./helpers/test_provider_configurator').configure();

const DatabaseCleaner = require('./helpers/database_cleaner');
const UserDataPreparationHelper = require('./helpers/user_data_preparation_helper');

const createFunction = require('.././create');
const updateFunction = require('.././update');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create')
    .setUpdateFunction(updateFunction, 'update');

const idLength = 36;

describe('update_user', () => {

    before((done) => {
        DatabaseCleaner.cleanDatabase()
            .then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase()
            .then(() => done());
    });

    it('Should update user password', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        let updatedUser = UserDataPreparationHelper.createUpdatedUser();
        updatedUser.password = '1234567';

        let expectations = (body) => {
            expect(body).to.have.property('password').that.equal('1234567');
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
    });

    it('Should update user role', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        let updatedUser = UserDataPreparationHelper.createUpdatedUser();
        updatedUser.isAdmin = true;

        let expectations = (body) => {
            expect(body).to.have.property('isAdmin').that.equal(true);
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
    });

    it('Shouldn\'t update user email', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        let updatedUser = UserDataPreparationHelper.createUpdatedUser();
        updatedUser.email = 'updated_test_mail@testmail.com';

        let expectations = (body) => {
            expect(body).to.have.property('email').that.equal(UserDataPreparationHelper.getDefaultEmail());
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
    });

    it('Shouldn\'t update user to have short password', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        let updatedUser = UserDataPreparationHelper.createUpdatedUser();
        updatedUser.password = '123';

        let expectations = generateErrorExpectations('Invalid password', 500);

        return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
    });

});

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}

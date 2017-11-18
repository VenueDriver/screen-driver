'use strict';

require('./helpers/test_provider_configurator').configure();

const DatabaseCleaner = require('./helpers/database_cleaner');
const UserDataPreparationHelper = require('./helpers/user_data_preparation_helper');

const UserPool = require('../src/user_pool/user_pool');
const TokenParser = require('lib/auth_token/auth_token_parser');

const createFunction = require('../src/user/create');
const updateFunction = require('../src/user/update');
const mochaPlugin = require('serverless-mocha-plugin');

const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create')
    .setUpdateFunction(updateFunction, 'update');

describe('update_user', () => {

    TokenParser.getCurrentUserDetails = chai.spy(() => {
        return {
            id: 'CognitoUserId',
            email: UserDataPreparationHelper.getDefaultEmail(),
            isAdmin: true
        }
    });

    UserPool.updateUser = chai.spy(() => {
        return new Promise((resolve, reject) => resolve({}));
    });

    before((done) => {
        DatabaseCleaner.cleanDatabase()
            .then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase()
            .then(() => done());
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

    it('Should update user email', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        let updatedUser = UserDataPreparationHelper.createUpdatedUser();
        updatedUser.email = 'updated_test_mail@testmail.com';

        let expectations = (body) => {
            expect(body).to.have.property('email').that.equal('updated_test_mail@testmail.com');
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
    });

});

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}

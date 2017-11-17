'use strict';

require('./helpers/test_provider_configurator').configure();

const DatabaseCleaner = require('./helpers/database_cleaner');
const UserDataPreparationHelper = require('./helpers/user_data_preparation_helper');

const UserPool = require('../src/user_pool/user_pool');
const TokenParser = require('../../lib/auth_token/auth_token_parser');

const _ = require('lodash');

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
            id: 'AdminUserId',
            email: UserDataPreparationHelper.getDefaultEmail(),
            isAdmin: true
        }
    });

    beforeEach(done => {
        DatabaseCleaner.cleanDatabase()
            .then(() => done());
    });

    describe('When user role changed to admin', () => {

        before(() => createSpyForUpdateUserInCognitoFunction());
        before(() => createSpyForCreateUserInCognitoFunction('CognitoUserId'));

        it('should set isAdmin to true and increase revision', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            let updatedUser = UserDataPreparationHelper.createUpdatedUser();
            updatedUser.isAdmin = true;

            let expectations = (body) => {
                expect(body.isAdmin).to.be.true;
                expect(body._rev).to.equal(1);
            };

            return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
        });

    });

    describe('When user role changed to plain user', () => {

        before(() => createSpyForUpdateUserInCognitoFunction());
        before(() => createSpyForCreateUserInCognitoFunction('CognitoUserId'));

        it('should set isAdmin to false and increase revision', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            user.isAdmin = true;
            let updatedUser = UserDataPreparationHelper.createUpdatedUser();
            updatedUser.isAdmin = false;

            let expectations = (body) => {
                expect(body.isAdmin).to.be.false;
                expect(body._rev).to.equal(1);
            };

            return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
        });

    });

    describe('When a user has isAdmin flag that is not boolean value', () => {

        before(() => createSpyForUpdateUserInCognitoFunction());
        before(() => createSpyForCreateUserInCognitoFunction('CognitoUserId'));

        it('should return an error', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            user.isAdmin = 'true';

            let expectations = generateErrorExpectations('User couldn\'t be without isAdmin flag', 500);

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

    });

    describe('When admin tries to change role of himself', () => {

        before(() => createSpyForUpdateUserInCognitoFunction());
        before(() => createSpyForCreateUserInCognitoFunction('AdminUserId'));

        it('should return an error', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            user.isAdmin = true;
            let updatedUser = _.cloneDeep(user);
            updatedUser.isAdmin = false;

            let expectations = generateErrorExpectations('You can\'t change role of yourself', 500);

            return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
        });

    });

    describe('When admin updates own profile but does not change role', () => {

        before(() => createSpyForUpdateUserInCognitoFunction());
        before(() => createSpyForCreateUserInCognitoFunction('AdminUserId'));

        it('should update successfully', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            user.isAdmin = true;
            let updatedUser = _.cloneDeep(user);

            let expectations = (body) => {
                expect(body.isAdmin).to.be.true;
                expect(body._rev).to.equal(1);
            };

            return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
        });

    });

    describe('When email changed', () => {

        before(() => createSpyForUpdateUserInCognitoFunction());
        before(() => createSpyForCreateUserInCognitoFunction('CognitoUserId'));

        it('Should not update user email', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            let updatedUser = UserDataPreparationHelper.createUpdatedUser();
            updatedUser.email = 'updated_test_mail@testmail.com';

            let expectations = (body) => {
                expect(body.email).to.equal(UserDataPreparationHelper.getDefaultEmail());
                expect(body._rev).to.equal(1);
            };

            return MultiOperationHelper.performUpdateTest(user, updatedUser, expectations);
        });

    });
});

function createSpyForUpdateUserInCognitoFunction() {
    UserPool.updateUser = chai.spy(() => {
        return new Promise((resolve, reject) => resolve({}));
    });
}

function createSpyForCreateUserInCognitoFunction(userId) {
    let congnitoUser = UserDataPreparationHelper.getCognitoUserWithSpecificId(userId);
    UserPool.createUser = chai.spy(() => {
        return new Promise((resolve, reject) => resolve(congnitoUser));
    });
}

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}

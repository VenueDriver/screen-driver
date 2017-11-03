'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');
const UserDataPreparationHelper = require('./helpers/user_data_preparation_helper');

const UserPool = require('../src/user_pool/user_pool');
const createFunction = require('../src/user/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create');

describe('create_user', () => {

    let congnitoUser = UserDataPreparationHelper.getCognitoUserWithAttributes();
    UserPool.createUser = chai.spy(() => {
        return new Promise((resolve, reject) => resolve(congnitoUser));
    });

    before((done) => {
        DatabaseCleaner.cleanDatabase()
            .then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase()
            .then(() => done());
    });

    it('Should create an operator user with all fields, id and revision number', () => {
        let user = UserDataPreparationHelper.createDefaultUser();

        let expectations = (body) => {
            expect(body).to.have.property('email').that.equal(UserDataPreparationHelper.getDefaultEmail());
            expect(body).to.have.property('isAdmin').that.equal(false);
            expect(body).to.have.property('_rev').that.equal(0);
        };

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    it('Should create an user with id that equal to sub of Cognito user', () => {
        let user = UserDataPreparationHelper.createDefaultUser();

        let expectations = (body) => {
            expect(body).to.have.property('id').that.equal('CognitoUserSub');
        };

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    it('Should create an admin user', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        user.isAdmin = true;

        let expectations = (body) => {
            expect(body).to.have.property('isAdmin').that.equal(true);
        };

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    // it('Shouldn\'t create a user with existing email', () => {
    //     let user = UserDataPreparationHelper.createDefaultUser();
    //
    //     let expectations = generateErrorExpectations('User with such email already exists', 500);
    //
    //     return MultiOperationHelper.create(user)
    //         .then(() => MultiOperationHelper.performCreateTest(user, expectations));
    // });

    it('Shouldn\'t create a user without email', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        user.email = null;

        let expectations = generateErrorExpectations('Invalid email', 500);

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    it('Shouldn\'t create a user with email without @ symbol', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        user.email = UserDataPreparationHelper.getEmailWithoutAtSymbol();

        let expectations = generateErrorExpectations('Invalid email', 500);

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    it('Shouldn\'t create a user with email with tld started with dot', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        user.email = UserDataPreparationHelper.getEmailWithTldStartedWithDot();

        let expectations = generateErrorExpectations('Invalid email', 500);

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    it('Shouldn\'t create a user with email with no symbols before @', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        user.email = UserDataPreparationHelper.getEmailWithoutCharactersBeforeAtSymbol();

        let expectations = generateErrorExpectations('Invalid email', 500);

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    it('Shouldn\'t create a user with email with invalid tld', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        user.email = UserDataPreparationHelper.getEmailWithNotValidTld();

        let expectations = generateErrorExpectations('Invalid email', 500);

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    it('Shouldn\'t create a user with email started with dot', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        user.email = UserDataPreparationHelper.getEmailStartedWithDot();

        let expectations = generateErrorExpectations('Invalid email', 500);

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    it('Shouldn\'t create a user with email with unexpected symbols', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        user.email = UserDataPreparationHelper.getEmailWithUnexpectedSymbols();

        let expectations = generateErrorExpectations('Invalid email', 500);

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

    it('Shouldn\'t create a user with email with double dots', () => {
        let user = UserDataPreparationHelper.createDefaultUser();
        user.email = UserDataPreparationHelper.getEmailWithDoubleDots();

        let expectations = generateErrorExpectations('Invalid email', 500);

        return MultiOperationHelper.performCreateTest(user, expectations);
    });

});

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}

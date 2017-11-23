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

    before((done) => {
        DatabaseCleaner.cleanDatabase()
            .then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase()
            .then(() => done());
    });

    describe('When user is valid', () => {

        before(() => createSpyForCreateUserInCognitoFunction());

        it('should create a user with all email, id and revision number', () => {
            let user = UserDataPreparationHelper.createDefaultUser();

            let expectations = (body) => {
                expect(body.id).to.not.be.null;
                expect(body.email).to.equal(UserDataPreparationHelper.getDefaultEmail());
                expect(body._rev).to.equal(0);
            };

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

        it('should create a user with id that is equal to sub of Cognito user', () => {
            let user = UserDataPreparationHelper.createDefaultUser();

            let expectations = (body) => {
                expect(body.id).to.equal('CognitoUserSub');
            };

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

        it('should create a user with generated uuid username', () => {
            let user = UserDataPreparationHelper.createDefaultUser();

            let expectations = (body) => {
                expect(body.username.split('-').length).to.equal(5);
            };

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

        it('should create a user without password', () => {
            let user = UserDataPreparationHelper.createDefaultUser();

            let expectations = (body) => {
                expect(body).to.not.have.property('password');
            };

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

        it('should create enabled user ', () => {
            let user = UserDataPreparationHelper.createDefaultUser();

            let expectations = (body) => {
                expect(body.enabled).to.be.true;
            };

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

    });

    describe('When a user is admin', () => {

        before(() => createSpyForCreateUserInCognitoFunction());

        it('should create a user with isAdmin = true', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            user.isAdmin = true;

            let expectations = (body) => {
                expect(body.isAdmin).to.be.true;
            };

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

    });

    describe('When a user is not admin', () => {

        before(() => createSpyForCreateUserInCognitoFunction());

        it('should create a user with isAdmin = false', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            user.isAdmin = false;

            let expectations = (body) => {
                expect(body.isAdmin).to.be.false;
            };

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

    });

    describe('When a user without isAdmin flag', () => {

        before(() => createSpyForCreateUserInCognitoFunction());

        it('should create user with isAdmin = false', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            user.isAdmin = null;

            let expectations = (body) => {
                expect(body.isAdmin).to.be.false;
            };

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

    });

    describe('When a user has isAdmin flag that is not boolean value', () => {

        before(() => createSpyForCreateUserInCognitoFunction());

        it('should return an error', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            user.isAdmin = 'true';

            let expectations = generateErrorExpectations('User couldn\'t be without isAdmin flag', 500);

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

    });

    describe('When email of a new user is already exists', () => {

        before(() => {
            createSpyForCreateUserInCognitoFunctionReturnedError('User with such email already exists');
        });

        it('should return an error', () => {
            let user = UserDataPreparationHelper.createDefaultUser();

            let expectations = generateErrorExpectations('User with such email already exists', 500);

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

    });

    describe('When user without email', () => {

        it('should return an error', () => {
            let user = UserDataPreparationHelper.createDefaultUser();
            user.email = null;

            let expectations = generateErrorExpectations('Invalid email', 500);

            return MultiOperationHelper.performCreateTest(user, expectations);
        });

    });

    describe('When user email is invalid', () => {

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

});

function createSpyForCreateUserInCognitoFunction() {
    let congnitoUser = UserDataPreparationHelper.getCognitoUserWithAttributes();
    UserPool.createUser = chai.spy(() => {
        return new Promise((resolve, reject) => resolve(congnitoUser));
    });
}

function createSpyForCreateUserInCognitoFunctionReturnedError(expectedError) {

    UserPool.createUser = chai.spy(() => {
        return new Promise((resolve, reject) => reject(expectedError));
    });
}

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}

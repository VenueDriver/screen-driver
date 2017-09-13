'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const updateFunction = require('../src/venues/update.js');
const createFunction = require('../src/venues/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setUpdateFunction(updateFunction, 'update')
    .setCreateFunction(createFunction, 'create');

const idLength = 36;

describe('update_venue', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    it('Should update venue name', () => {
        let newVenue = {name: "Hakkasan"};
        let updatedVenue = {name: "Hakkasan LV", _rev: 0};
        let expectation = (body) => {
            expect(body).to.have.property("name").that.equal("Hakkasan LV");
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Should update venue screen groups names', () => {
        let newVenue = {name: "Hakkasan", screen_groups: [{name: "Touch"}, {name: "Deli"}]};
        let updatedVenue = {name: "Hakkasan", screen_groups: [{name: "Menu"}, {name: "Restaurant"}], _rev: 0};

        let expectation = (body) => {
            expect(body.screen_groups[0]).to.have.property("name").that.equal("Menu");
            expect(body.screen_groups[1]).to.have.property("name").that.equal("Restaurant");
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Should add screen group to existing venue, and id should be generated automatically', () => {
        let newVenue = {name: "Hakkasan", screen_groups: [{name: "Touch"}]};
        let updatedVenue = {name: "Hakkasan", screen_groups: [{name: "Touch"}, {name: "Deli"}], _rev: 0};

        let expectation = (body) => {
            expect(body.screen_groups[0]).to.have.property("name").that.equal("Touch");
            expect(body.screen_groups[1]).to.have.property("name").that.equal("Deli");
            expect(body.screen_groups[1]).to.have.property("id").with.lengthOf(idLength);
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Should add screen to existing screen group, and id should be generated automatically', () => {
        let newVenue = {name: "Hakkasan", screen_groups: [{name: "Touch", screens: [{name: "A"}]}]};
        let updatedVenue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A"}, {name: "B"}]}],
            _rev: 0
        };

        let expectation = (body) => {
            expect(body.screen_groups[0].screens[0]).to.have.property("name").that.equal("A");
            expect(body.screen_groups[0].screens[1]).to.have.property("name").that.equal("B");
            expect(body.screen_groups[0].screens[1]).to.have.property("id").with.lengthOf(idLength);
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Shouldn\'t change venue name to existing name', () => {
        let existingVenue = {name: "Hakkasan LV"};
        let newVenue = {name: "Hakkasan"};
        let updatedVenue = {name: "Hakkasan LV", _rev: 0};

        let expectation = (body, response) => {
                expect(response).to.have.property("statusCode").that.equal(500);
                expect(body).to.have.property("message").that.equal("Venue with such name already exists")
        };

        return MultiOperationHelper.create(existingVenue)
            .then(() => MultiOperationHelper.create(newVenue))
            .then(response => MultiOperationHelper.update(response, updatedVenue))
            .then(response => MultiOperationHelper.test(response, expectation));
    });

    it('Shouldn\'t add new screen group with non-unique name', () => {
        let newVenue = {name: "Hakkasan LV", screen_groups: [{name: "Touch"}]};
        let updatedVenue = {name: "Hakkasan LV", screen_groups: [{name: "Touch"}, {name: "Touch"}], _rev: 0};

        let expectation = (body, response) => {
            expect(response).to.have.property("statusCode").that.equal(500);
            expect(body).to.have.property("message").that.equal("Groups should have unique names");
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Shouldn\'t add new screen with non-unique name', () => {
        let newVenue = {
            name: "Hakkasan LV",
            screen_groups: [
                {
                    name: "Touch",
                    screens: [{name: "A"}]
                }]
        };
        let updatedVenue = {
            name: "Hakkasan LV",
            screen_groups: [
                {
                    name: "Touch",
                    screens: [{name: "A"}, {name: "A"}]
                }],
            _rev: 0
        };

        let expectation = (body, response) => {
            expect(response).to.have.property("statusCode").that.equal(500);
            expect(body).to.have.property("message").that.equal("Screens should have unique names");
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Shouldn\'t delete venue name', () => {
        let newVenue = {name: "Hakkasan LV"};
        let updatedVenue = {_rev: 0};

        let expectation = (body, response) => {
            expect(response).to.have.property("statusCode").that.equal(500);
            expect(body).to.have.property("message").that.equal("Venue couldn\'t be without name");
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Shouldn\'t delete group name', () => {
        let newVenue = {name: "Hakkasan LV", screen_groups: [{name: "Touch"}]};
        let updatedVenue = {name: "Hakkasan LV", screen_groups: [{}], _rev: 0};

        let expectation = (body, response) => {
            expect(response).to.have.property("statusCode").that.equal(500);
            expect(body).to.have.property("message").that.equal("Screen group couldn\'t be without name");
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Shouldn\'t delete screen name', () => {
        let newVenue = {
            name: "Hakkasan LV",
            screen_groups: [
                {name: "Touch", screens: [{name: "A"}]}]
        };
        let updatedVenue = {
            name: "Hakkasan LV",
            screen_groups: [
                {name: "Touch", screens: [{}]}],
            _rev: 0
        };

        let expectation = (body, response) => {
            expect(response).to.have.property("statusCode").that.equal(500);
            expect(body).to.have.property("message").that.equal("Screen couldn\'t be without name");
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Shouldn\'t update venue without revision number', () => {
        let newVenue = {name: "Hakkasan"};
        let updatedVenue = {name: "Hakkasan LV"};

        let expectation = (body, response) => {
            expect(response).to.have.property("statusCode").that.equal(500);
            expect(body).to.have.property("message").that.equal("Missed revision number");
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

    it('Shouldn\'t update venue with uncorrect revision number', () => {
        let newVenue = {name: "Hakkasan"};
        let updatedVenue = {name: "Hakkasan LV", _rev: 1};

        let expectation = (body, response) => {
            expect(response).to.have.property("statusCode").that.equal(500);
            expect(body).to.have.property("message").that.equal("The conditional request failed");
        };

        return MultiOperationHelper.performUpdateTest(newVenue, updatedVenue, expectation);
    });

});


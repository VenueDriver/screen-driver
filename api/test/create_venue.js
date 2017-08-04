'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const createFunction = require('../venues/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;
const assert = mochaPlugin.chai.assert;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create');

const idLength = 36;

describe('create_venue', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    it('Should create venue with name', () => {
        let venue = {name: "Hakkasan"};
        let params = {};

        let expectations = (body, response) => {
            expect(response.statusCode).to.equal(200);
            expect(body).to.have.property("name").that.equal("Hakkasan");
            expect(body).to.have.property("screen_groups").to.be.an('array').that.is.empty;
            expect(body).to.have.property("_rev").that.equal(0);
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Should create venue and id should be generated automatically and revision number should be equal to 0', () => {
        let venue = {
            name: "Hakkasan",
        };

        let expectations = (body, response) => {
            expect(response.statusCode).to.equal(200);
            assert(body.id.length == idLength, 'Should have id');
            assert(body._rev == 0, 'should have revision number == 0');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Should create screen group and id should be generated automatically', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch"}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 200);
            assert(typeof body.screen_groups[0].id === 'string');
            assert(body.screen_groups[0].id.length == idLength);
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Should create venue with screen groups with names', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch"}, {name: "Deli"}]
        };

        let expectations = (body, response) => {
            expect(response.statusCode).to.equal(200);
            expect(body).to.have.property("screen_groups").that.is.an('array');
            expect(body).to.have.property("screen_groups").with.lengthOf(2);

            expect(body.screen_groups[0]).to.have.property("name").that.is.equal('Touch');
            expect(body.screen_groups[0]).to.have.property("id").with.lengthOf(idLength);

            expect(body.screen_groups[1]).to.have.property("name").that.is.equal('Deli');
            expect(body.screen_groups[1]).to.have.property("id").with.lengthOf(idLength);
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Should create screen group with screens', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A"}, {name: "B"}]}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 200);
            assert(body.screen_groups[0].name === "Touch");
            assert(body.screen_groups[0].screens.length == 2);
            assert(body.screen_groups[0].screens[0].name === "A");
            assert(body.screen_groups[0].screens[1].name === "B");
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Should create screen and id shold be generated automatically', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A"}]}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 200);
            assert(body.screen_groups[0].screens[0].id.length == idLength);
            assert(typeof body.screen_groups[0].screens[0].id === 'string');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Should create screen with name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A"}]}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 200);
            assert(body.screen_groups[0].screens[0].name === "A");
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Should create screen with content id', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A", content_id: "710b962e-041c-11e1-9234-0123456789ab"}]}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 200);
            assert(body.screen_groups[0].screens[0].name === "A");
            assert(body.screen_groups[0].screens[0].content_id === "710b962e-041c-11e1-9234-0123456789ab");
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Shouldn\'t create venue without name', () => {
        let venue = {};

        let expectations = (body, response) => {
            assert(response.statusCode == 500);
            assert(body.message == 'Venue couldn\'t be without name');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Shouldn\'t create venue with empty name', () => {
        let venue = {name: ''};

        let expectations = (body, response) => {
            assert(response.statusCode == 500);
            assert(body.message == 'Venue couldn\'t be without name');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Shouldn\'t create venue with existing name', () => {
        let venue = {name: "Hakkasan"};

        let expectations = (body, response) => {
            expect(response.statusCode).to.equal(500);
            expect(body).to.have.property("message").that.equal("Venue with such name already exists");
        };

        return MultiOperationHelper.create(venue)
            .then(() => MultiOperationHelper.performCreateTest(venue, expectations));
    });

    it('Shouldn\'t create screen group without name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 500);
            assert(body.message == 'Screen group couldn\'t be without name', 'shouldn\'t create group without name');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Shouldn\'t create screen group with empty name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: ''}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 500);
            assert(body.message == 'Screen group couldn\'t be without name');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Shouldn\'t create screen groups with non unique names', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch"}, {name: "Touch"}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 500);
            assert(body.message == 'Groups should have unique names');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Shouldn\'t create screen without name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{}]}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 500);
            assert(body.message == 'Screen couldn\'t be without name');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Shouldn\'t create screen with empty name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: ''}]}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 500);
            assert(body.message == 'Screen couldn\'t be without name');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

    it('Shouldn\'t create screens with non unique name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A"}, {name: "A"}]}]
        };

        let expectations = (body, response) => {
            assert(response.statusCode == 500);
            assert(body.message == 'Screens should have unique names');
        };

        return MultiOperationHelper.performCreateTest(venue, expectations);
    });

});

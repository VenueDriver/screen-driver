'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const getAllFunction = require('../venues/list.js');
const createFunction = require('../venues/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;
const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setGetAllFunction(getAllFunction, 'list')
    .setCreateFunction(createFunction, 'create');

let idLength = 36;

describe('venues_list', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    it('I can see empty list, if we don\'t have venues', () => {
        return MultiOperationHelper.getAll().then((response) => {
            let body = JSON.parse(response.body);
            expect(body).to.be.an('array').that.is.empty;
        });
    });

    it('I can see 1 venue if we have 1 venue', () => {
        let venue = {name: "Hakkasan"};

        let expectations = (body) => {
            expect(body).to.be.an('array').to.have.lengthOf(1);
        };

        return MultiOperationHelper.performListTest(venue, expectations);
    });


    it('I can see all venues with names', () => {
        let firstVenue = {name: "Hakkasan LV",};
        let secondVenue = {name: "Hakkasan CA",};

        let expectations = (body) => {
            let names = body.map(element => element['name']);
            expect(body).to.be.an('array').to.have.lengthOf(2);
            expect(body[0]).to.have.property("_rev").that.equal(0);
            expect(body[1]).to.have.property("_rev").that.equal(0);
            expect('Hakkasan LV').to.be.oneOf(names);
            expect('Hakkasan CA').to.be.oneOf(names);
        };

        return MultiOperationHelper.performListTest([firstVenue, secondVenue], expectations);
    });

    it('I can see id\'s for every screen', () => {
        let firstVenue = {name: "Hakkasan LV"};
        let secondVenue = {name: "Hakkasan CA"};

        let expectations = (body) => {
            expect(body[0]).to.have.property("id").with.lengthOf(idLength);
            expect(body[1]).to.have.property("id").with.lengthOf(idLength);
        };

        return MultiOperationHelper.performListTest([firstVenue, secondVenue], expectations);
    });

    it('I can see all venues with screen groups if they\'re exist', () => {
        let firstVenue = {name: "Hakkasan LV", screen_groups: [{name: 'Touch'}, {name: 'Deli'}]};
        let secondVenue = {name: "Hakkasan CA"};

        let expectations = (body) => {
            let firstVenueNames = body
                .find(venue => venue.name === 'Hakkasan LV')
                .screen_groups.map(group => group.name);
            let secondVenue = body.find(venue => venue.name === 'Hakkasan CA');

            expect('Touch').to.be.oneOf(firstVenueNames);
            expect('Deli').to.be.oneOf(firstVenueNames);
            expect(firstVenueNames).to.be.an('array').to.have.lengthOf(2);
            expect(secondVenue.screen_groups).to.be.an('array').that.is.empty;
        };

        return MultiOperationHelper.performListTest([firstVenue, secondVenue], expectations);
    });

    it('I can see all venues with screens if they are exists', () => {
        let venue = {
            name: "Hakkasan LV",
            screen_groups: [
                {name: 'Touch', screens: [{name: "A"}]},
                {name: 'Deli'}
            ]
        };

        let expectations = (body) => {
            expect(body[0].screen_groups[0].screens).to.be.an('array').to.have.lengthOf(1);
            expect(body[0].screen_groups[0].screens[0]).to.have.property('name').that.equal('A');
            expect(body[0].screen_groups[1].screens).to.be.an('array').that.is.empty;
        };

        return MultiOperationHelper.performListTest(venue, expectations);
    });

});

function findByName(array, name) {
    return array.find(element => element['name'] === name);
}

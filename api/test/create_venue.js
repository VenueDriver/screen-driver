'use strict';

// tests for create_venue
// Generated by serverless-mocha-plugin
require('./helpers/TestProviderConfigurator').configure();
const DatabaseCleaner = require('./helpers/DatabaseCleaner');

const lambda = require('../venues/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;
const assert = mochaPlugin.chai.assert;
const wrapped = lambdaWrapper.wrap(lambda, {handler: 'create'});

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
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.have.property("name").that.equal("Hakkasan");
            expect(response.body).to.have.property("screen_groups").to.be.an('array').that.is.empty;
            expect(response.body).to.have.property("_rev").that.equal(0);
        });
    });

    it('Should create venue and id should be generated automatically and revision number should be equal to 0', () => {
        let venue = {
            name: "Hakkasan",
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            expect(response.statusCode).to.equal(200);
            assert(response.body.id.length == idLength);
            assert(response.body._rev == 0);
        });
    });

    it('Should create screen group and id should be generated automatically', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch"}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 200 );
            assert(typeof response.body.screen_groups[0].id === 'string');
            assert(response.body.screen_groups[0].id.length == idLength);
        });
    });

    it('Should create venue with screen groups with names', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch"}, {name: "Deli"}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.have.property("screen_groups").that.is.an('array');
            expect(response.body).to.have.property("screen_groups").with.lengthOf(2);

            expect(response.body.screen_groups[0]).to.have.property("name").that.is.equal('Touch');
            expect(response.body.screen_groups[0]).to.have.property("id").with.lengthOf(idLength);

            expect(response.body.screen_groups[1]).to.have.property("name").that.is.equal('Deli');
            expect(response.body.screen_groups[1]).to.have.property("id").with.lengthOf(idLength);
        });
    });

    it('Should create screen group with screens', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A"}, {name: "B"}]}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 200);
            assert(response.body.screen_groups[0].name === "Touch");
            assert(response.body.screen_groups[0].screens.length == 2);
            assert(response.body.screen_groups[0].screens[0].name === "A");
            assert(response.body.screen_groups[0].screens[1].name === "B");
        });
    });

    it('Should create screen and id shold be generated automatically', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A"}]}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 200);
            assert(response.body.screen_groups[0].screens[0].id.length == idLength);
            assert(typeof response.body.screen_groups[0].screens[0].id === 'string');
        });
    });

    it('Should create screen with name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A"}]}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 200);
            assert(response.body.screen_groups[0].screens[0].name === "A");
        });
    });

    it('Should create screen with content id', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A", content_id: "710b962e-041c-11e1-9234-0123456789ab"}]}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 200);
            assert(response.body.screen_groups[0].screens[0].name === "A");
            assert(response.body.screen_groups[0].screens[0].content_id === "710b962e-041c-11e1-9234-0123456789ab");
        });
    });

    it('Shouldn\'t create venue without name', () => {
        let venue = {};
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 500);
            assert(response.body.message == 'Venue couldn\'t be without name');
        });
    });

    it('Shouldn\'t create venue with empty name', () => {
        let venue = {name: ''};
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 500);
            assert(response.body.message == 'Venue couldn\'t be without name');
        });
    });

    it('Shouldn\'t create venue with existing name', () => {
        let venue = {name: "Hakkasan"};
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            expect(response.statusCode).to.equal(200);
            wrapped.run(params).then(response => {
                response.body = JSON.parse(response.body);
                expect(response.statusCode).to.equal(500);
                expect(response.body).to.have.property("message").that.equal("Venue with such name already exists");
            });
        });
    });

    it('Shouldn\'t create screen group without name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 500);
            assert(response.body.message == 'Screen group couldn\'t be without name');
        });
    });

    it('Shouldn\'t create screen group with empty name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: ''}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 500);
            assert(response.body.message == 'Screen group couldn\'t be without name');
        });
    });

    it('Shouldn\'t create screen groups with non unique names', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch"}, {name: "Touch"}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 500);
            assert(response.body.message == 'Groups should have unique names');
        });
    });

    it('Shouldn\'t create screen without name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{}]}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 500);
            assert(response.body.message == 'Screen couldn\'t be without name');
        });
    });

    it('Shouldn\'t create screen with empty name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: ''}]}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 500);
            assert(response.body.message == 'Screen couldn\'t be without name');
        });
    });

    it('Shouldn\'t create screens with non unique name', () => {
        let venue = {
            name: "Hakkasan",
            screen_groups: [{name: "Touch", screens: [{name: "A"}, {name: "A"}]}]
        };
        let params = {};
        params.body = JSON.stringify(venue);

        return wrapped.run(params).then(response => {
            response.body = JSON.parse(response.body);
            assert(response.statusCode == 500);
            assert(response.body.message == 'Screens should have unique names');
        });
    });

});

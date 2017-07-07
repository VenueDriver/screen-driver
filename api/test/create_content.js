'use strict';

// tests for create_content
// Generated by serverless-mocha-plugin
require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const mod = require('../content/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const lambdaWrapper = mochaPlugin.lambdaWrapper;
const expect = mochaPlugin.chai.expect;
const wrapped = lambdaWrapper.wrap(mod, {handler: 'create'});

const idLength = 36;

describe('create_content', () => {
    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });


    it('Should create content with short name', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};
        let params = {};
        params.body = JSON.stringify(content);

        return wrapped.run(params).then(response => {
            let body = JSON.parse(response.body);
            expect(body).to.have.property('short_name').that.equal('Hakkasan');
            expect(body).to.have.property('url').that.equal('http://example.com');
        });
    });

    it('Should create id automatically', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};
        let params = {};
        params.body = JSON.stringify(content);

        return wrapped.run(params).then(response => {
            let body = JSON.parse(response.body);
            expect(body).to.have.property('id').with.lengthOf(idLength);
        });
    });

    it('Shouldn\'t create content without short name', () => {
        let content = {url: 'http://example.com'};
        let params = {};
        params.body = JSON.stringify(content);

        return wrapped.run(params).then(response => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        });
    });

    it('Shouldn\'t create content with empty short name', () => {
        let content = {short_name: '', url: 'http://example.com'};
        let params = {};
        params.body = JSON.stringify(content);

        return wrapped.run(params).then(response => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        });
    });

    it('Shouldn\'t create content with non-unique short name', () => {
        let content = {short_name: 'Hakkasan', url: 'http://example.com'};
        let params = {};
        params.body = JSON.stringify(content);

        return wrapped.run(params).then(() => {
            wrapped.run(params).then(response => {
                let body = JSON.parse(response.body);
                expect(response.statusCode).equal(500);
                expect(body).to.have.property('message').that.equal('Content with such name already exists');
            })
        });
    });

    it('Shouldn\'t create content without url', () => {
        let content = {short_name: 'Hakkasan'};
        let params = {};
        params.body = JSON.stringify(content);

        return wrapped.run(params).then(response => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        });
    });

    it('Shouldn\'t create content with empty url', () => {
        let content = {short_name: 'Hakkasan', url: ''};
        let params = {};
        params.body = JSON.stringify(content);

        return wrapped.run(params).then(response => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).equal(500);
            expect(body).to.have.property('message').that.equal('Content object should contain short_name and url fields');
        });
    });
});

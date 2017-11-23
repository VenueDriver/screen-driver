'use strict';

const mochaPlugin = require('serverless-mocha-plugin');
const PasswordGenerator = require('../src/helpers/password_generator');
const expect = mochaPlugin.chai.expect;

const _ = require('lodash');

describe('PasswordGenerator', () => {

    describe('generate()', () => {

        context('When called', () => {
            it('should return random string that matches /^(?=.*\\d)(?=.*[a-zA-Z]).{8}$/ regexp', () => {
                let pattern = /^(?=.*\d)(?=.*[a-zA-Z]).{8}$/;
                let regexp = new RegExp(pattern);
                PasswordGenerator.generate().then(generatedString => {
                    let matchingResult = regexp.test(generatedString);
                    expect(matchingResult).to.be.true;
                }).catch(error => {});
            });
        });

        context('When called 5 times', () => {
            it('should return different results', () => {
                let promises = [];
                for (let i = 0; i < 5; i++) {
                    promises.push(PasswordGenerator.generate());
                }
                Promise.all(promises).then(generatedStrings => {
                    expect(_.uniq(generatedStrings).length).to.equal(5);
                }).catch(error => {});
            });
        });

    });

});

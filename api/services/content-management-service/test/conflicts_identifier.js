'use strict';

const ConflictsIdentifier = require('../src/setting/helpers/conflicts_identifier');

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;

describe('conflicts_identifier', () => {
    describe('_detectConflictInConfigs', () => {
        let settings;

        before(() => {
            settings = [
                { id: "1", config: {screen_1: 'content_1'} },
                { id: "2", config: {screen_2: 'content_2', screen_3: 'content_1'} },
                { id: "3", config: {screen_1: 'content_1', screen_3: 'content_1'} },
            ];
        });

        it('Should return conflicted fields if content id deffer for the same screen', () => {
            let settingToUpdate = settings[0];
            settingToUpdate.config = {screen_1: 'content_2'};

            let result = ConflictsIdentifier._detectConflictInConfigs(settings, settingToUpdate);

            expect(result).to.deep.equal([{settingId: "3", config: {screen_1: 'content_1', screen_3: 'content_1'}}]);
        });

        it('Should return blank array if conflict configs do not intersect', () => {
            let settingToUpdate = settings[0];
            settingToUpdate.config = {screen_id_4: 'content_id'};

            let result = ConflictsIdentifier._detectConflictInConfigs(settings, settingToUpdate);

            expect(result).to.deep.equal([]);
        });

        it('Should return blank array if content id the same in conflicted configs', () => {
            let settingToUpdate = settings[0];
            settingToUpdate.config = {screen_id: 'content_id'};

            let result = ConflictsIdentifier._detectConflictInConfigs(settings, settingToUpdate);

            expect(result).to.deep.equal([]);
        });
    });
});

'use strict';

const ConflictsIdentifier = require('../src/setting/helpers/conflicts_identifier');

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;

describe('conflicts_identifier', () => {
    describe('_detectConflictInConfigs', () => {
        it('Should return conflicted fields if content id deffer for the same screen', () => {
            let settings = createBaseSetOfSettings();
            let settingToUpdate = {config: {screen_id: 'content_id_2'}};

            let result = ConflictsIdentifier._detectConflictInConfigs(settings, settingToUpdate);

            expect(result).to.deep.equal([{settingId: "setting", config: {screen_id: 'content_id'}}]);
        });

        it('Should return blank object if conflict configs do not intersect', () => {
            let settings = createBaseSetOfSettings();
            let settingToUpdate = {config: {screen_id_4: 'content_id'}};

            let result = ConflictsIdentifier._detectConflictInConfigs(settings, settingToUpdate);

            expect(result).to.deep.equal([]);
        });

        it('Should return blank object if content id the same in conflicted configs', () => {
            let settings = createBaseSetOfSettings();
            let settingToUpdate = {config: {screen_id: 'content_id'}};

            let result = ConflictsIdentifier._detectConflictInConfigs(settings, settingToUpdate);

            expect(result).to.deep.equal([]);
        });
    });
});

function createBaseSetOfSettings() {
    return [
        { id: "setting", config: {screen_id: 'content_id'} },
        { id: "setting2", config: {screen_id_2: 'content_id', screen_id_3: 'content_id'} },
    ];
}
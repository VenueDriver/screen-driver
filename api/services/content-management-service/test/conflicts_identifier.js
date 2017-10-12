'use strict';

const _ = require('lodash');

const ConflictsIdentifier = require('../src/setting/helpers/conflicts_identifier');

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;

describe('conflicts_identifier', () => {
    describe('_detectConflictInConfigs', () => {
        context('When several settings present', () => {
            let settings;
            let settingToUpdate;

            before(() => {
                settings = [
                    {id: "1", config: {screen_1: 'content_1'}},
                    {id: "2", config: {screen_2: 'content_2', screen_3: 'content_1'}},
                    {id: "3", config: {screen_1: 'content_1', screen_3: 'content_1'}},
                ];
                settingToUpdate = _.cloneDeep(settings[0]);
            });

            it('should return conflicted fields if content id deffer for the same screen', () => {
                settingToUpdate.config = {screen_1: 'content_2'};

                let result = ConflictsIdentifier._detectConflictInConfigs(settings, settingToUpdate);

                expect(result).to.deep.equal([{
                    settingId: "3",
                    config: {screen_1: 'content_1', screen_3: 'content_1'}
                }]);
            });

            it('should return blank array if conflict configs do not intersect', () => {
                settingToUpdate.config = {screen_id_4: 'content_id'};

                let result = ConflictsIdentifier._detectConflictInConfigs(settings, settingToUpdate);

                expect(result).to.deep.equal([]);
            });

            it('should return blank array if content id the same in conflicted configs', () => {
                settingToUpdate.config = {screen_id: 'content_id'};

                let result = ConflictsIdentifier._detectConflictInConfigs(settings, settingToUpdate);

                expect(result).to.deep.equal([]);
            });
        });

        context('When only one setting with appropriate type exists', () => {
            let existingSetting;
            let settingToUpdate;

            before(() => {
                existingSetting = {id: "1", config: {screen_1: 'content_1'}};
                settingToUpdate = _.cloneDeep(existingSetting);
            });

            it('should return blank array if configs are defer', () => {
                settingToUpdate.config = {screen_1: 'content_2'};

                let result = ConflictsIdentifier._detectConflictInConfigs([existingSetting], settingToUpdate);

                expect(result).to.deep.equal([]);
            });

            it('should return blank array if configs the same', () => {
                settingToUpdate.config = {screen_1: 'content_1'};

                let result = ConflictsIdentifier._detectConflictInConfigs([existingSetting], settingToUpdate);

                expect(result).to.deep.equal([]);
            });
        });
    });
});

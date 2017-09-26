'use strict';

require('./helpers/test_provider_configurator').configure();
const DatabaseCleaner = require('./helpers/database_cleaner');

const createFunction = require('../src/setting/create');
const updateFunction = require('../src/setting/update');
const mochaPlugin = require('serverless-mocha-plugin');

const TestDataSever = require('./helpers/test_data_saver');
const PriorityTypes = require('../src/enums/priority_types');
const SettingDataPreparationHelper = require('./helpers/setting_data_preparation_helper');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create')
    .setUpdateFunction(updateFunction, 'update');

const idLength = 36;

describe('update_setting', () => {

    before((done) => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase().then(() => done());
    });

    it('Should update the name and increase revision', () => {
        let newSetting = {name: 'New Year Party', priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', _rev: 0, priority: 'test_id_1'};

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('name').that.equal('New Year');
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Should enable setting', () => {
        let newSetting = {name: 'New Year', enabled: false, priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', enabled: true, _rev: 0, priority: 'test_id_1'};

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(true);
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Should enable forciblyEnabled state', () => {
        let newSetting = {name: 'New Year Party', forciblyEnabled: false, priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', forciblyEnabled: true, priority: 'test_id_1', _rev: 0,};

        let expectations = (body) => {
            expect(body).to.have.property('forciblyEnabled').that.equal(true);
        };

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Should disable forciblyEnabled state', () => {
        let newSetting = {name: 'New Year Party', forciblyEnabled: true, priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', forciblyEnabled: false, priority: 'test_id_1', _rev: 0,};

        let expectations = (body) => {
            expect(body).to.have.property('forciblyEnabled').that.equal(false);
        };

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting with wrong forcibly enabled updated sate', () => {
        let newSetting = {name: 'New Year Party', forciblyEnabled: false, priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', forciblyEnabled: 'string', priority: 'test_id_1', _rev: 0,};

        let expectations = (body, response) => {
            expect(body).to.have.property('message').that.equal('Forcibly enabled field should be type of boolean');
            expect(response).to.have.property('statusCode').that.equal(500);
        };

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Should update setting with new config', () => {
        let config = {screen_id: 'content_id'};
        let newSetting = {name: 'New Year', enabled: true, priority: PriorityTypes.getTypeIds()[0], config: config};

        let updatedConfig = {screen_id: 'content_id_2'};
        let updatedSetting = {name: 'New Year', enabled: true, _rev: 0, priority: PriorityTypes.getTypeIds()[0], config: updatedConfig};

        let expectations = (body) => {
            expect(body).to.have.property('config').that.to.deep.equal(updatedConfig);
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Should update persistent setting with conflicts in config', () => {
        let existingSetting = SettingDataPreparationHelper.getPersistentSettingWithConfig('Regular');
        let newSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {});
        let updatedSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {screen_id: 'content_id_2'});

        let expectations = (body) => {
            expect(body).to.have.property('_rev').that.equal(1);
        };

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

    it('Should response with an error code if conflict in persistent setting detected', () => {
        let existingSetting = SettingDataPreparationHelper.getPersistentSettingWithConfig('Regular');
        let newSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {});
        let updatedSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {screen_id: 'content_id_2'});

        let expectations = (body, response) => {
            expect(response).to.have.property('statusCode').that.equal(409);
        };

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

    it('Should set updated setting status to false if conflict in persistent setting detected', () => {
        let existingSetting = SettingDataPreparationHelper.getPersistentSettingWithConfig('Regular');
        let newSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {});
        let updatedSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {screen_id: 'content_id_2'});

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(false);
        };

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

    it('Should update persistent setting if conflict was not detected', () => {
        let existingSetting = SettingDataPreparationHelper.getPersistentSettingWithConfig('Regular');
        let newSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {});
        let updatedSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {screen_id_3: 'content_id'});

        let expectations = (body, response) => {
            expect(body).to.have.property('_rev').that.equal(1);
            expect(response).to.have.property('statusCode').that.equal(200);
        };

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

    it('Should not change a state of an updated persistent setting if conflict was not detected', () => {
        let existingSetting = SettingDataPreparationHelper.getPersistentSettingWithConfig('Regular');
        let newSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {});
        let updatedSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {screen_id_3: 'content_id'});

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(true);
        };

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

    it('Should set updated setting status to true if conflict with disabled setting detected', () => {
        let existingSetting = SettingDataPreparationHelper.getPersistentSettingWithConfig('Regular');
        existingSetting.enabled = false;
        let newSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {});
        let updatedSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {screen_id: 'content_id_2'});

        let expectations = (body) => {
            expect(body).to.have.property('enabled').that.equal(true);
        };

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

    it('Should update disabled and conflicted setting with success code', () => {
        let existingSetting = SettingDataPreparationHelper.getPersistentSettingWithConfig('Regular');
        let newSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {});
        newSetting.enabled = false;
        let updatedSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {screen_id: 'content_id_2'});
        updatedSetting.enabled = false;

        let expectations = (body, response) => {
            expect(body).to.have.property('_rev').that.equal(1);
            expect(response).to.have.property('statusCode').that.equal(200);
        };

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

    it('Should update conflicted setting with success code if new state of setting is false', () => {
        let existingSetting = SettingDataPreparationHelper.getPersistentSettingWithConfig('Regular');
        let newSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {});
        let updatedSetting = SettingDataPreparationHelper.getPersistentSetting('Regular2', {screen_id: 'content_id_2'});
        updatedSetting.enabled = false;

        let expectations = (body, response) => {
            expect(body).to.have.property('_rev').that.equal(1);
            expect(response).to.have.property('statusCode').that.equal(200);
        };

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

    it('Should update periodical setting if content URL coincides in conflicted settings', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 10 * * MON',
            newEventCron: '0 0 9 * * MON',
            newEndEventCron: '0 0 10 * * MON',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting with enabled status if content URL coincides in conflicted settings', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 10 * * MON',
            newEventCron: '0 0 9 * * MON',
            newEndEventCron: '0 0 10 * * MON',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(body).to.have.property('enabled').that.equal(true);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting if schedules for conflicted settings have different time periods', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 9 * * MON',
            newEventCron: '0 0 10 * * MON',
            newEndEventCron: '0 0 11 * * MON',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting with enabled status if schedules for conflicted settings have different time periods', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 30 9 * * MON',
            newEventCron: '0 45 9 * * MON',
            newEndEventCron: '0 0 11 * * MON',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('enabled').that.equal(true);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting and response with an error if schedules for conflicted settings have the same time periods', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 10 * * MON',
            newEventCron: '0 0 9 * * MON',
            newEndEventCron: '0 0 10 * * MON',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(409);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting with disabled status if schedules for conflicted settings have the same time periods', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 10 * * MON',
            newEventCron: '0 0 9 * * MON',
            newEndEventCron: '0 0 10 * * MON',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('enabled').that.equal(false);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting if schedules for conflicted settings are created for different weekdays', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 10 * * MON',
            newEventCron: '0 0 9 * * TUE',
            newEndEventCron: '0 0 10 * * TUE',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting with enabled status if schedules for conflicted settings are created for different weekdays', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 10 * * MON',
            newEventCron: '0 0 9 * * TUE',
            newEndEventCron: '0 0 10 * * TUE',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('enabled').that.equal(true);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting if schedules for conflicted settings are created for different set of weekdays', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON,TUE,WED',
            existingEndEventCron: '0 0 10 * * MON,TUE,WED',
            newEventCron: '0 0 9 * * THU,FRI,SAT',
            newEndEventCron: '0 0 10 * * THU,FRI,SAT',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting with enabled status if schedules for conflicted settings are created for different set of weekdays', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON,TUE,WED',
            existingEndEventCron: '0 0 10 * * MON,TUE,WED',
            newEventCron: '0 0 9 * * THU,FRI,SAT',
            newEndEventCron: '0 0 10 * * THU,FRI,SAT',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('enabled').that.equal(true);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting with disabled status if conflict in settings detected', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 10 * * MON',
            newEventCron: '0 0 9 * * MON',
            newEndEventCron: '0 0 11 * * MON',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('enabled').that.equal(false);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting but response with an error if conflict in settings detected', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 10 * * MON',
            newEventCron: '0 0 9 * * MON',
            newEndEventCron: '0 0 11 * * MON',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(409);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update periodical setting if conflict with disabled schedule detected', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 * * MON',
            existingEndEventCron: '0 0 10 * * MON',
            newEventCron: '0 0 9 * * MON',
            newEndEventCron: '0 0 11 * * MON',
        };
        return TestDataSever.savePeriodicalSettingsWithSchedules(cronExpressions, config, false)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getPeriodicalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update occasional setting if content URL coincides in conflicted settings', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 1 JAN * 2017',
            existingEndEventCron: '0 0 8 2 JAN * 2017',
            newEventCron: '0 0 8 1 JAN * 2017',
            newEndEventCron: '0 0 8 2 JAN * 2017',
        };
        return TestDataSever.saveOccasionalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id'};
                let updatedSetting = SettingDataPreparationHelper.getOccasionalSetting('New Year', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update occasional setting with enabled status if content URL coincides in conflicted settings', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 1 JAN * 2017',
            existingEndEventCron: '0 0 8 2 JAN * 2017',
            newEventCron: '0 0 8 1 JAN * 2017',
            newEndEventCron: '0 0 8 2 JAN * 2017',
        };
        return TestDataSever.saveOccasionalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id'};
                let updatedSetting = SettingDataPreparationHelper.getOccasionalSetting('New Year', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('enabled').that.equal(true);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update occasional setting if schedules for conflicted settings have different time periods', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 1 JAN * 2017',
            existingEndEventCron: '0 0 10 1 JAN * 2017',
            newEventCron: '0 0 11 1 JAN * 2017',
            newEndEventCron: '0 0 12 1 JAN * 2017',
        };
        return TestDataSever.saveOccasionalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getOccasionalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update occasional setting with enabled status if schedules for conflicted settings have different time periods', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 1 JAN * 2017',
            existingEndEventCron: '0 0 10 1 JAN * 2017',
            newEventCron: '0 0 11 1 JAN * 2017',
            newEndEventCron: '0 0 12 1 JAN * 2017',
        };
        return TestDataSever.saveOccasionalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getOccasionalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('enabled').that.equal(true);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update occasional setting and response with an error if schedules for conflicted settings have the same time periods', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 30 8 1 JAN * 2017',
            existingEndEventCron: '0 45 10 1 JAN * 2017',
            newEventCron: '0 0 10 1 JAN * 2017',
            newEndEventCron: '0 0 11 1 JAN * 2017',
        };
        return TestDataSever.saveOccasionalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getOccasionalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(409);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update occasional setting with disabled status if schedules for conflicted settings have the same time periods', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 30 8 1 JAN * 2017',
            existingEndEventCron: '0 45 10 1 JAN * 2017',
            newEventCron: '0 0 10 1 JAN * 2017',
            newEndEventCron: '0 0 11 1 JAN * 2017',
        };
        return TestDataSever.saveOccasionalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getOccasionalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('enabled').that.equal(false);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update occasional setting if schedules for conflicted settings are created for different dates', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 1 JAN * 2017',
            existingEndEventCron: '0 0 10 1 JAN * 2017',
            newEventCron: '0 0 8 2 JAN * 2017',
            newEndEventCron: '0 0 10 2 JAN * 2017',
        };
        return TestDataSever.saveOccasionalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getOccasionalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update occasional setting with enabled status if schedules for conflicted settings are created for different dates', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 0 8 1 JAN * 2017',
            existingEndEventCron: '0 0 10 1 JAN * 2017',
            newEventCron: '0 0 8 2 JAN * 2017',
            newEndEventCron: '0 0 10 2 JAN * 2017',
        };
        return TestDataSever.saveOccasionalSettingsWithSchedules(cronExpressions, config)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getOccasionalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body) => {
                    expect(body).to.have.property('enabled').that.equal(true);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Should update occasional setting if conflict with disabled schedule detected', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let cronExpressions = {
            existingEventCron: '0 30 8 1 JAN * 2017',
            existingEndEventCron: '0 45 10 1 JAN * 2017',
            newEventCron: '0 0 10 1 JAN * 2017',
            newEndEventCron: '0 0 11 1 JAN * 2017',
        };
        return TestDataSever.saveOccasionalSettingsWithSchedules(cronExpressions, config, false)
            .then((newSetting) => {
                let updatedConfig = {screen_id: 'content_id_2'};
                let updatedSetting = SettingDataPreparationHelper.getOccasionalSetting('Coffee Morning Menu', updatedConfig);
                return MultiOperationHelper.update({body: JSON.stringify(newSetting)}, updatedSetting);
            })
            .then(updatedSetting => {
                let expectation = (body, response) => {
                    expect(body).to.have.property('_rev').that.equal(1);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(updatedSetting, expectation);
            });
    });

    it('Shouldn\'t update setting without name', () => {
        let newSetting = {name: 'New Year'};
        let updatedSetting = {_rev: 0};

        let expectations = generateErrorExpectations('Setting couldn\'t be without name', 500);

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting with empty name', () => {
        let newSetting = {name: 'New Year'};
        let updatedSetting = {name: '', _rev: 0};

        let expectations = generateErrorExpectations('Setting couldn\'t be without name', 500);

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting with name length 3 or less', () => {
        let newSetting = {name: 'New Year'};
        let updatedSetting = {name: 'NYP', _rev: 0};

        let expectations = generateErrorExpectations('Setting\'s name should be longer then 3 symbols', 500);

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting with non-boolean enable field', () => {
        let newSetting = {name: 'New Year', priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', enabled: 'string', priority: 'test_id_1', _rev: 0};

        let expectations = generateErrorExpectations('Enabled field should be boolean', 500);

        return MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations);
    });

    it('Shouldn\'t update setting with existing name', () => {
        let existingSetting = {name: 'New Year', priority: 'test_id_1'};
        let newSetting = {name: 'New Year Party', priority: 'test_id_1'};
        let updatedSetting = {name: 'New Year', _rev: 0, priority: 'test_id_1'};

        let expectations = generateErrorExpectations('Setting with such name already exists', 500);

        return MultiOperationHelper.create(existingSetting)
            .then(() => MultiOperationHelper.performUpdateTest(newSetting, updatedSetting, expectations));
    });

});

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}

'use strict';

require('./helpers/test_provider_configurator').configure();

const DatabaseCleaner = require('./helpers/database_cleaner');
const TestDataSaver = require('./helpers/test_data_saver');
const ScheduleDataPreparationHelper = require('./helpers/schedule_data_preparation_helper');
const SettingDataPreparationHelper = require('./helpers/setting_data_preparation_helper');

const createFunction = require('../src/schedule/create.js');
const mochaPlugin = require('serverless-mocha-plugin');

const expect = mochaPlugin.chai.expect;

const MultiOperationHelper = require('./helpers/multi_operation_test_helper')
    .configure()
    .setCreateFunction(createFunction, 'create');

const idLength = 36;

describe('create_schedule', () => {

    before((done) => {
        DatabaseCleaner.cleanDatabase()
            .then(() => TestDataSaver.saveDefaultSetting())
            .then(() => done());
    });

    afterEach(done => {
        DatabaseCleaner.cleanDatabase()
            .then(() => TestDataSaver.saveDefaultSetting())
            .then(() => done());
    });


    it('Should create schedule with all fields, id and revision number', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.enabled = false;

        let expectations = (body) => {
            expect(body).to.have.property('id').with.lengthOf(idLength);
            expect(body).to.have.property('settingId').that.equal('setting_id');
            expect(body).to.have.property('eventCron').that.equal(ScheduleDataPreparationHelper.getDefaultCronExpression());
            expect(body).to.have.property('endEventCron').that.equal(ScheduleDataPreparationHelper.getDefaultCronExpression());
            expect(body).to.have.property('enabled').that.equal(false);
            expect(body).to.have.property('_rev').that.equal(0);
        };

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Should create schedule with automatically generated `enabled` field', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();

        let expectations = (body)=> {
            expect(body).to.have.property('enabled').that.equal(true);
        };

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Should create schedule without unknown fields', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.date = new Date();

        let expectations = (body) => {
            expect(body).to.not.have.not.property('data');
        };

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule without setting id', () => {
        let schedule = ScheduleDataPreparationHelper.createScheduleWithoutSettingId();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without setting', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule without eventCron', () => {
        let schedule = ScheduleDataPreparationHelper.createScheduleWithoutEventCron();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without eventCron', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule without endEventCron', () => {
        let schedule = ScheduleDataPreparationHelper.createScheduleWithoutEndEventCron();

        let expectations = generateErrorExpectations('Schedule couldn\'t be without endEventCron', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule without periodicity', () => {
        let schedule = ScheduleDataPreparationHelper.createScheduleWithoutPeriodicity();

        let expectations = generateErrorExpectations('Invalid periodicity', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with invalid periodicity', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.periodicity = 'SOME_PERIODICITY';

        let expectations = generateErrorExpectations('Invalid periodicity', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with invalid cron expressions', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '*';
        schedule.endEventCron = '*';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that includes non 0 value for seconds', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '1 0 8 1 JUN * 2017';
        schedule.endEventCron = '1 0 8 1 JUN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that should be repeated every minute', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 * 8 1 JUN * 2017';
        schedule.endEventCron = '0 * 8 1 JUN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that should be repeated every N minutes', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 */2 8 1 JUN * 2017';
        schedule.endEventCron = '0 */2 8 1 JUN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that should be repeated every hour', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 0 * 1 JAN * 2017';
        schedule.endEventCron = '0 0 * 1 JAN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create schedule with cron expression that should be repeated every N hours', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 0 */8 1 JUN * 2017';
        schedule.endEventCron = '0 0 */8 1 JUN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create one time schedule that should be repeated every day', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 0 13 * JAN * 2017';
        schedule.endEventCron = '0 0 13 * JAN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create one time schedule that should be repeated every N days', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 0 13 */5 JAN * 2017';
        schedule.endEventCron = '0 0 13 */5 JAN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create one time schedule that should be repeated every month', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 0 13 1 * * 2017';
        schedule.endEventCron = '0 0 13 1 * * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create one time schedule that should be repeated every N months', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 0 13 1 */5 * 2017';
        schedule.endEventCron = '0 0 13 1 */5 * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create one time schedule that should be repeated every year', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 0 8 1 JAN * *';
        schedule.endEventCron = '0 0 8 1 JAN * *';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create one time schedule that should be repeated every N years', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 0 8 1 JAN * */5';
        schedule.endEventCron = '0 0 8 1 JAN * */5';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create one time schedule with cron expression that includes invalid amount of parts', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultOneTimeSchedule();
        schedule.eventCron = '0 0 8 1 JAN MON';
        schedule.endEventCron = '0 0 8 1 JAN MON';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create repeatable schedule with cron expression that includes invalid amount of parts', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultRepeatableSchedule();
        schedule.eventCron = '0 0 8 1 JAN * 2017';
        schedule.endEventCron = '0 0 8 1 JAN * 2017';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create repeatable schedule with cron expression that includes date', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultRepeatableSchedule();
        schedule.eventCron = '0 0 8 1 * MON';
        schedule.endEventCron = '0 0 8 1 * MON';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    it('Shouldn\'t create repeatable schedule with cron expression that includes month', () => {
        let schedule = ScheduleDataPreparationHelper.createDefaultRepeatableSchedule();
        schedule.eventCron = '0 0 8 * JAN MON';
        schedule.endEventCron = '0 0 8 * JAN MON';

        let expectations = generateErrorExpectations('Invalid cron expression', 500);

        return MultiOperationHelper.performCreateTest(schedule, expectations);
    });

    // it('Shouldn\'t create schedule bound with unknown setting', () => {
    //     let schedule = ScheduleDataPreparationHelper.createDefaultRepeatableSchedule();
    //     schedule.settingId = 'invalid_setting_id';
    //
    //     let expectations = generateErrorExpectations('Invalid setting', 500);
    //
    //     return MultiOperationHelper.performCreateTest(schedule, expectations);
    // });

    it('Should create schedule and set status to disabled if conflict detected', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let existingSetting = SettingDataPreparationHelper.getPeriodicalSetting('Morning', config);

        let conflictedConfig = {screen_id: 'content_id_2'};
        let scheduledSetting = SettingDataPreparationHelper.getPeriodicalSetting('Morning2', conflictedConfig);

        return TestDataSaver.saveSetting(existingSetting)
            .then(setting => {
                let schedule = ScheduleDataPreparationHelper.createRepeatableSchedule('0 0 8 * * MON', '0 0 10 * * MON', setting.id);
                return TestDataSaver.saveSchedule(schedule);
            })
            .then(() => TestDataSaver.saveSetting(scheduledSetting))
            .then(setting => {
                let newSchedule = ScheduleDataPreparationHelper.createRepeatableSchedule('0 0 8 * * MON', '0 0 10 * * MON', setting.id);
                return MultiOperationHelper.create(newSchedule);
            })
            .then(schedule => {
                let expectations = (body) => {
                    expect(body).to.have.property('enabled').that.equal(false);
                };
                return MultiOperationHelper.test(schedule, expectations);
            });
    });

    it('Should create schedule and return error status if conflict detected', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let existingSetting = SettingDataPreparationHelper.getPeriodicalSetting('Morning', config);

        let conflictedConfig = {screen_id: 'content_id_2'};
        let scheduledSetting = SettingDataPreparationHelper.getPeriodicalSetting('Morning2', conflictedConfig);

        return TestDataSaver.saveSetting(existingSetting)
            .then(setting => {
                let schedule = ScheduleDataPreparationHelper.createRepeatableSchedule('0 0 8 * * MON', '0 0 10 * * MON', setting.id);
                return TestDataSaver.saveSchedule(schedule);
            })
            .then(() => TestDataSaver.saveSetting(scheduledSetting))
            .then(setting => {
                let newSchedule = ScheduleDataPreparationHelper.createRepeatableSchedule('0 0 8 * * MON', '0 0 10 * * MON', setting.id);
                return MultiOperationHelper.create(newSchedule);
            })
            .then(schedule => {
                let expectations = (body, response) => {
                    expect(response).to.have.property('statusCode').that.equal(409);
                };
                return MultiOperationHelper.test(schedule, expectations);
            });
    });

    it('Should create schedule and set status to enabled if conflict was not detected between schedules with time overlap', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let existingSetting = SettingDataPreparationHelper.getPeriodicalSetting('Morning', config);

        let conflictedConfig = {screen_id: 'content_id'};
        let scheduledSetting = SettingDataPreparationHelper.getPeriodicalSetting('Morning2', conflictedConfig);

        return TestDataSaver.saveSetting(existingSetting)
            .then(setting => {
                let schedule = ScheduleDataPreparationHelper.createRepeatableSchedule('0 0 8 * * MON', '0 0 10 * * MON', setting.id);
                return TestDataSaver.saveSchedule(schedule);
            })
            .then(() => TestDataSaver.saveSetting(scheduledSetting))
            .then(setting => {
                let newSchedule = ScheduleDataPreparationHelper.createRepeatableSchedule('0 0 8 * * MON', '0 0 10 * * MON', setting.id);
                return MultiOperationHelper.create(newSchedule);
            })
            .then(schedule => {
                let expectations = (body, response) => {
                    expect(body).to.have.property('enabled').that.equal(true);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(schedule, expectations);
            });
    });

    it('Should create schedule and set status to enabled if conflict detected between schedules without time overlap', () => {
        let config = {screen_id: 'content_id', screen_id_2: 'content_id_2'};
        let existingSetting = SettingDataPreparationHelper.getPeriodicalSetting('Morning', config);

        let conflictedConfig = {screen_id: 'content_id_2'};
        let scheduledSetting = SettingDataPreparationHelper.getPeriodicalSetting('Morning2', conflictedConfig);

        return TestDataSaver.saveSetting(existingSetting)
            .then(setting => {
                let schedule = ScheduleDataPreparationHelper.createRepeatableSchedule('0 0 8 * * MON', '0 0 10 * * MON', setting.id);
                return TestDataSaver.saveSchedule(schedule);
            })
            .then(() => TestDataSaver.saveSetting(scheduledSetting))
            .then(setting => {
                let newSchedule = ScheduleDataPreparationHelper.createRepeatableSchedule('0 0 8 * * TUE', '0 0 10 * * TUE', setting.id);
                return MultiOperationHelper.create(newSchedule);
            })
            .then(schedule => {
                let expectations = (body, response) => {
                    expect(body).to.have.property('enabled').that.equal(true);
                    expect(response).to.have.property('statusCode').that.equal(200);
                };
                return MultiOperationHelper.test(schedule, expectations);
            });
    });

});

function generateErrorExpectations(message, statusCode) {
    return (body, response) => {
        expect(body).to.have.property('message').that.equal(message);
        expect(response).to.have.property('statusCode').that.equal(statusCode);
    };
}
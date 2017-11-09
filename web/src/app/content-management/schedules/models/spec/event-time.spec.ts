
import {EventTime} from "../event-time.model";
import {Periodicity} from "../../../../core/enums/periodicity";
import {EventDateUtils} from "../../event-time/event-date.utils";

describe('Model: EventTime', () => {

    describe('constructor()', () => {

        it('should initialize default event time', () => {
            let eventTime = new EventTime();

            expect(eventTime.periodicity).toBe(Periodicity.ONE_TIME);
            expect(eventTime.weekDays).toBe('SUN');
            expect(eventTime.startDate.getDate()).toBe(EventDateUtils.getTomorrowDate().getDate());
            expect(eventTime.endDate).toBe(eventTime.startDate);
            expect(eventTime.startTime).toBe('8:00');
            expect(eventTime.startTimePeriod).toBe('AM');
            expect(eventTime.endTime).toBe('1:00');
            expect(eventTime.endTimePeriod).toBe('PM');

        });

    });

});

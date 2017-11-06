import {Periodicity} from '../../../core/enums/periodicity';
import {DaysOfWeek, getShortDay} from '../../../core/enums/days-of-week';
import {EventDateUtils} from "../event-time/event-date.utils";

export class EventTime {

    periodicity = Periodicity.ONE_TIME;
    daysOfWeek = getShortDay(DaysOfWeek.SUN);
    startDate: Date = EventDateUtils.getTomorrowDate();
    endDate = this.startDate;
    startTime = '8:00';
    startTimePeriod = 'AM';
    endTime = '1:00';
    endTimePeriod = 'PM';

}

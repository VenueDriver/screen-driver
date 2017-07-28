export class EventTime {

    startDate = new Date();
    endDate = this.startDate;
    startTime = '8:00';
    startTimePeriod = 'AM';
    endTime = '1:00';
    endTimePeriod = 'PM';

    validate(): boolean {
        if (!this.isDateValid()) {
            return false;
        }
        if (this.startDate.getTime() === this.endDate.getTime()) {
            return this.isTimeValid();
        }
        return true;
    }

    static getHours(time: string, timePeriod: string): number {
        return EventTime.convertTimeToDate(time, timePeriod).getHours();
    }

    private isTimeValid(): boolean {
        let startTime = EventTime.convertTimeToDate(this.startTime, this.startTimePeriod);
        let endTime = EventTime.convertTimeToDate(this.endTime, this.endTimePeriod);
        return endTime > startTime;
    }

    private isDateValid(): boolean {
        return !!(this.startDate && this.endDate);
    }

    private static convertTimeToDate(time: string, timePeriod: string): Date {
        return new Date(`2000-01-01 ${time} ${timePeriod}`);
    }
}
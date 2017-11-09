export class EventDateUtils {

    static getTomorrowDate(): Date {
        let today = new Date();
        return new Date(today.setDate(today.getDate() + 1));
    }

    static getHours(time: string, timePeriod: string): number {
        return EventDateUtils.convertTimeToDate(time, timePeriod).getHours();
    }

    static convertTimeToDate(time: string, timePeriod: string, date?: Date): Date {
        let convertedDate = new Date(`2000/01/01 ${time} ${timePeriod}`);
        if (date) {
            convertedDate.setFullYear(date.getFullYear());
            convertedDate.setMonth(date.getMonth());
            convertedDate.setDate(date.getDate());
        }
        return convertedDate;
    }
}

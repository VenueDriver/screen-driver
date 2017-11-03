export class ScheduleDateUtils {
    static getTomorrowDate(): Date {
        let today = new Date();
        return new Date(today.setDate(today.getDate() + 1));
    }

    static getHours(time: string, timePeriod: string): number {
        return ScheduleDateUtils.convertTimeToDate(time, timePeriod).getHours();
    }

    static convertTimeToDate(time: string, timePeriod: string): Date {
        return new Date(`2000/01/01 ${time} ${timePeriod}`);
    }
}

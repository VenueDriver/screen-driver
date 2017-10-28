export class CronToDatetimeConverter {

    static getDateFromCron(cron: string): Date {
        if (!cron) {
            return new Date();
        }
        let parts = cron.split(' ');
        let year = +parts[6];
        let month = parts[4];
        let dayOfMonth = +parts[3];
        return new Date(`${month} ${dayOfMonth}, ${year}`);
    }

    static getMinutesFromCron(cron: string): string {
        if (!cron) {
            return '';
        }
        let parts = cron.split(' ');
        let minutes = parts[1];
        return +minutes < 10 ? `0${minutes}` : minutes;
    }

    static getHoursFromCron(cron: string): number {
        if (!cron) {
            return 0;
        }
        let parts = cron.split(' ');
        return +parts[2];
    }

    static getWeekDaysFromCron(cron: string): string {
        if (!cron) {
            return '';
        }
        let parts = cron.split(' ');
        return parts[5];
    }
}
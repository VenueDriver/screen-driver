export class CronToDatetimeConverter {

    static getDateFromCron(cron: string) {
        let parts = cron.split(' ');
        let year = +parts[6];
        let month = parts[4];
        let dayOfMonth = +parts[3];
        return new Date(`${month} ${dayOfMonth}, ${year}`);
    }

    static getMinutesFromCron(cron: string): number {
        let parts = cron.split(' ');
        return +parts[1];
    }

    static getHoursFromCron(cron: string): number {
        let parts = cron.split(' ');
        return +parts[2];
    }
}
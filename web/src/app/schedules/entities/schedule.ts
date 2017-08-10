export class Schedule {

    id: string;
    settingId: string;
    eventCron: string;
    endEventCron: string;
    periodicity: string;
    enabled: boolean = true;
    _rev: number;
}
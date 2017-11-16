export class KioskVersionDetailsMap {
    [screenId: string]: KioskVersionDetails
}

export class KioskVersionDetails {
    screenId: string;
    version: string;
    updatedAt: Date;
    timezone: number
}

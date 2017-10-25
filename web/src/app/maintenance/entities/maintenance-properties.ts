import {AutoupdateSchedule} from "./autoupdate-schedule";
import {KioskVersion} from "./kiosk-version";
import {VenueMaintenanceInfo} from "./venue-maintenance-info";

export interface MaintenanceProperties {
    venues: Array<VenueMaintenanceInfo>;
    autoupdateSchedules: Array<AutoupdateSchedule>;
    kioskVersions: Array<KioskVersion>;
}
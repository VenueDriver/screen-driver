import {AutoupdateSchedule} from "./autoupdate-schedule";
import {VenueMaintenanceInfo} from "./venue-maintenance-info";
import {KioskVersionDetailsMap} from "./kiosk-version-details";

export interface MaintenanceProperties {
    venues: Array<VenueMaintenanceInfo>;
    autoupdateSchedules: Array<AutoupdateSchedule>;
    kioskVersions: KioskVersionDetailsMap;
}

import {AutoupdateSchedule} from "./autoupdate-schedule";
import {VenueMaintenanceInfo} from "./venue-maintenance-info";

export interface MaintenanceProperties {
    venues: Array<VenueMaintenanceInfo>;
    autoupdateSchedules: Array<AutoupdateSchedule>;
    kioskVersions: any;
}
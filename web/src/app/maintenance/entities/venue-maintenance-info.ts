import {Venue} from "../../content-management/venues/entities/venue";
import {AutoupdateSchedule} from "./autoupdate-schedule";

export class VenueMaintenanceInfo extends Venue {

    autoupdateSchedule: AutoupdateSchedule;
}

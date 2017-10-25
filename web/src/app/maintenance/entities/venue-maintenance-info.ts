import {Venue} from "../../venues/entities/venue";
import {AutoupdateSchedule} from "./autoupdate-schedule";

export class VenueMaintenanceInfo extends Venue {

    autoupdateSchedule: AutoupdateSchedule;
}

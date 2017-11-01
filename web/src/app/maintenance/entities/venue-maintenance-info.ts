import {Venue} from "../../core/entities/venue";
import {AutoupdateSchedule} from "./autoupdate-schedule";

export class VenueMaintenanceInfo extends Venue {

    autoupdateSchedule: AutoupdateSchedule;
}

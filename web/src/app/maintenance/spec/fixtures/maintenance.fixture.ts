import * as _ from 'lodash';
import {VenueMaintenanceInfo} from "../../entities/venue-maintenance-info";

export class MaintenanceFixture {

    static venueMaintenanceInfo(count: number): Array<VenueMaintenanceInfo> {
        return _.range(count).map((index) => {
            const venue = new VenueMaintenanceInfo();
            venue.id = index;
            return venue;
        });
    }
}

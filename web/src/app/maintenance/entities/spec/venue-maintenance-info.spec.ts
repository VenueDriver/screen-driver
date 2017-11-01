/* tslint:disable:no-unused-variable */


import {VenueMaintenanceInfo} from "../venue-maintenance-info";
import {Venue} from "../../../core/entities/venue";

describe('VenueMaintenanceInfo', () => {

    it('should extends from Venue', () => {
        expect(Venue.isPrototypeOf(VenueMaintenanceInfo)).toBeTruthy();
    });
});

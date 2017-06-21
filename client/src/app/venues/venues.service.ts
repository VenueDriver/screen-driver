import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Venue} from "./entities/venue";
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

@Injectable()
export class VenuesService {

    constructor(private http: Http) { }

    loadVenues(): Observable<Response> {
        return this.http.get('api/venues');
    }

    getVenuesForTree(venues: Venue[]) {
        let venuesTree = _.clone(venues);
        this.convertToTree(venuesTree);
        return venuesTree;
    }

    saveVenue(venue: Venue): Observable<Response> {
        return this.http.post('api/venues', venue);
    }

    private convertToTree(items: Array<any>) {
        items.forEach(item => this.performConverting(item));
    }

    private performConverting(item) {
        this.convertSubItemsToNodes(item, 'screen_groups');
        this.convertSubItemsToNodes(item, 'screens');
        if (item.children) {
            this.convertToTree(item.children);
        }
    }

    private convertSubItemsToNodes(venue, subItemsArrayName) {
        if (venue[subItemsArrayName]) {
            venue.children = venue[subItemsArrayName];
            delete venue[subItemsArrayName];
        }
    }
}

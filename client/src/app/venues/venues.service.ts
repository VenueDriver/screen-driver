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
        items.forEach(item => this.performConvertingToTree(item));
    }

    private performConvertingToTree(item) {
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

    updateVenues(dataToUpdate: any): Observable<Response> {
        let venues = this.prepareVenuesToUpdate(dataToUpdate.venues);
        let venueToUpdate = _.find(venues, venue => venue.id === dataToUpdate.id);
        return this.http.put(`api/venues/${venueToUpdate.id}`, venueToUpdate);
    }

    private prepareVenuesToUpdate(venuesTree: any) {
        let venues = _.clone(venuesTree);
        this.convertTreeToVenues(venues, 1);
        return venues;
    }

    private convertTreeToVenues(venuesTree: any, level: number) {
        venuesTree.forEach(item => this.performConvertingToVenues(item, level));
    }

    private performConvertingToVenues(node: any, level: number) {
        this.convertNodeToVenue(node, level);
    }

    private convertNodeToVenue(node: any, level: number) {
        if (level == 1 && node.children) {
            node.screen_groups = node.children;
            delete node.children;
            if (node.screen_groups) {
                this.convertTreeToVenues(node.screen_groups, level + 1);
            }
        }
        if (level == 2 && node.children) {
            node.screens = node.children;
            delete node.children;
        }
    }
}

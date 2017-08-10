import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import { environment } from '../../environments/environment';
import {Venue} from "./entities/venue";
import { Observable } from 'rxjs/Observable';
import {Content} from "../content/content";
import {ContentService} from "../content/content.service";

import * as _ from 'lodash';
import {Subject, BehaviorSubject} from "rxjs";

@Injectable()
export class VenuesService {
    readonly venuesApiPath = `${environment.apiUrl}/api/venues`;

    private venueUpdate: Subject<any> = new BehaviorSubject({});

    constructor(
        private http: Http,
        private contentService: ContentService
    ) { }

    loadVenues(): Observable<Response> {
        return this.http.get(this.venuesApiPath);
    }

    loadContent(): Observable<Content[]> {
        return this.contentService.getContent();
    }

    getVenuesForTree(venues: Venue[]) {
        let venuesTree = _.clone(venues);
        this.convertToTree(venuesTree);
        return venuesTree;
    }

    saveVenue(venue: Venue): Observable<Response> {
        return this.http.post(this.venuesApiPath, venue);
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

    updateVenue(venueNode: any): Observable<Response> {
        let venue = this.prepareVenuesToUpdate(venueNode);
        return this.http.put(`${this.venuesApiPath}/${venueNode.id}`, venue);
    }

    private prepareVenuesToUpdate(venueNode: any): Venue {
        this.convertChildrenToSubItem(venueNode, 'screen_groups');
        if (venueNode.screen_groups) {
            _.forEach(venueNode.screen_groups, group => this.convertChildrenToSubItem(group, 'screens'));
        }
        return venueNode;
    }

    private convertChildrenToSubItem(node, subItemsArrayName) {
        if (node.children) {
            node[subItemsArrayName] = node.children;
            delete node.children;
        }
    }

    getValidationMessage(item: string) {
        return `${item} with such name already exists`;
    }

    pushVenueUpdateEvent() {
        this.venueUpdate.next();
    }

    getVenueUpdateSubscription(): Observable<any> {
        return this.venueUpdate;
    }

    deleteVenue(venueId: any): Observable<any> {
        return this.http.delete(`${this.venuesApiPath}/${venueId}`);
    }

    deleteScreenGroup(venueId: string, screenGroupId: string) {
        return this.http.delete(`${this.venuesApiPath}/${venueId}/screen_groups/${screenGroupId}`);
    }

    getVenueId(node: any) {
        let parentNode = node.parent;
        switch (node.level) {
            case 1: return node.data.id;
            case 2: return parentNode.data.id;
            default: return parentNode.parent.data.id;
        }
    }
}

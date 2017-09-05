import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {Venue} from "./entities/venue";
import { Observable } from 'rxjs/Observable';
import {Content} from "../content/content";
import {ContentService} from "../content/content.service";

import * as _ from 'lodash';
import {Subject, BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class VenuesService {
    readonly venuesApiPath = `${environment.apiUrl}/api/venues`;

    private venueUpdate: Subject<any> = new BehaviorSubject({});

    constructor(
        private httpClient: HttpClient,
        private contentService: ContentService
    ) { }

    loadVenues(): Observable<Array<Venue>> {
        return this.httpClient.get(this.venuesApiPath);
    }

    loadContent(): Observable<Content[]> {
        return this.contentService.getContent();
    }

    getVenuesForTree(venues: Venue[]) {
        let venuesTree = _.clone(venues);
        this.convertToTree(venuesTree);
        return venuesTree;
    }

    saveVenue(venue: Venue): Observable<Venue> {
        return this.httpClient.post(this.venuesApiPath, venue);
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

    updateVenue(venueNode: any): Observable<Venue> {
        let venue = this.prepareVenuesToUpdate(venueNode);
        return this.httpClient.put(`${this.venuesApiPath}/${venueNode.id}`, venue);
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
        return this.httpClient.delete(`${this.venuesApiPath}/${venueId}`);
    }

    deleteScreenGroup(venueId: string, screenGroupId: string) {
        return this.httpClient.delete(`${this.venuesApiPath}/${venueId}/screen_groups/${screenGroupId}`);
    }

    deleteScreen(venueId: string, screenGroupId: string, screenId: string) {
        return this.httpClient.delete(`${this.venuesApiPath}/${venueId}/screen_groups/${screenGroupId}/screens/${screenId}`);
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

import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Venue} from "./entities/venue";
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';
import {Content} from "../content/content";
import {ContentService} from "../content/content.service";

@Injectable()
export class VenuesService {
    readonly venuesApiPath = 'api/venues';

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

    initContentListForDropdown(content: Content[]): any {
        let contentListForDropdown = this.convertContentListForDropdown(content);
        contentListForDropdown = _.sortBy(contentListForDropdown, 'name');
        return [this.getDefaultUrlValue(), ...contentListForDropdown];
    }

    private convertContentListForDropdown(content: Content[]): any {
        return _.map(content, c => {
            c.name = c.short_name;
            c.description = c.url;
            return c;
        });
    }

    private getDefaultUrlValue() {
        return {
            id: '',
            name: 'Default'
        }
    }
}

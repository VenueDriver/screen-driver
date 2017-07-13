import { Injectable } from '@angular/core';
import {VenuesTreeViewService} from "../venues-tree-view/venues-tree-view.service";
import {VenuesService} from "../venues.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {Content} from "../../content/content";
import {ContentService} from "../../content/content.service";

@Injectable()
export class EditTreeViewNodeFormService {

    constructor(
        private treeViewService: VenuesTreeViewService,
        private venuesService: VenuesService,
        private contentService: ContentService
    ) { }

    getNodeLevelName(node: any): string {
        return node ? this.treeViewService.getNodeLevelName(node.level) : 'Venue';
    }

    getValidationMessageForNodeName(node: any): string {
        let nodeLevelName = this.getNodeLevelName(node);
        return this.venuesService.getValidationMessage(nodeLevelName);
    }

    updateVenue(venueToUpdate: any): Observable<Response> {
        return this.venuesService.updateVenue(venueToUpdate);
    }

    saveVenue(venue: any): Observable<Response> {
        return this.venuesService.saveVenue(venue);
    }

    saveNewContent(content: Content): Observable<Content> {
        return this.contentService.createContent(content);
    }

    pushVenueUpdateEvent() {
        this.venuesService.pushVenueUpdateEvent();
    }

    pushContentUpdateEvent() {
        this.contentService.pushContentUpdateEvent();
    }
}
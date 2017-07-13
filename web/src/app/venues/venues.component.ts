import {Component, OnInit} from '@angular/core';
import {VenuesService} from "./venues.service";
import {Venue} from "./entities/venue";
import {Content} from "../content/content";
import {NotificationService} from "../notifications/notification.service";
import {VenuesTreeViewService} from "./venues-tree-view/venues-tree-view.service";

import * as _ from 'lodash';
import {Observable} from "rxjs";
import {ConfigStateHolderService} from "../configurations/configuration-state-manager/config-state-holder.service";
import {Configuration} from "../configurations/entities/configuration";

@Component({
    selector: 'venues',
    templateUrl: 'venues.component.html',
    styleUrls: ['venues.component.sass'],
    providers: [VenuesService]
})
export class VenuesComponent implements OnInit {

    venues: Venue[];
    venuesTree: any;
    content: Content[];
    config: Configuration;
    isShowAddVenueForm = false;
    isCreateContentMode = false;

    constructor(private venuesService: VenuesService,
                private treeViewService: VenuesTreeViewService,
                private notificationService: NotificationService,
                private configStateHolderService: ConfigStateHolderService,) {
    }

    ngOnInit() {
        this.loadVenues();
        this.loadContent();
        this.configStateHolderService.getCurrentConfig().subscribe(config => {
            this.config = config;
            this.mergeLocationsWithConfig(this.venues, this.config);
        });
    }

    loadVenues() {
        this.venuesService.loadVenues().subscribe(response => {
            this.venues = response.json();
            this.venuesTree = this.venuesService.getVenuesForTree(this.venues);
        });
    }

    loadContent() {
        this.venuesService.loadContent()
            .subscribe(content => this.content = _.sortBy(content, 'short_name'));
    }

    showAddVenueForm() {
        this.isShowAddVenueForm = true;
    }

    hideAddVenueForm() {
        this.isShowAddVenueForm = false;
    }

    addVenue(venue: Venue) {
        this.venuesService.saveVenue(venue)
            .subscribe(
                response => this.handleResponse(response),
                error => this.handleError('Unable to perform save operation'));
    }

    handleResponse(response: any) {
        if (response.ok) {
            this.hideAddVenueForm();
        }
        this.loadVenues();
    }

    performSubmit(venue: Venue) {
        if (this.isCreateContentMode) {
            this.createContentBeforeCreateVenue(venue);
        } else {
            this.addVenue(venue);
        }
    }

    createContentBeforeCreateVenue(venue: Venue) {
        this.saveNewContent(venue.content)
            .subscribe(
                content => this.handleCreateContentResponse(venue, content),
                error => this.handleError('Unable to save new content')
            );
    }

    handleCreateContentResponse(venue: Venue, content: Content) {
        this.loadContent();
        venue.content_id = content.id;
        this.addVenue(venue);
    }

    saveNewContent(content: Content): Observable<Content> {
        return this.treeViewService.saveNewContent(content);
    }

    updateVenue(venueNode: any) {
        this.venuesService.updateVenue(venueNode)
            .subscribe(
                response => this.loadVenues(),
                error => this.handleError('Unable to update configuration'));
    }

    handleError(errorMessage: string) {
        return this.notificationService.showErrorNotificationBar(errorMessage);
    }

    toggleCreateContentMode(createContentMode: boolean) {
        this.isCreateContentMode = createContentMode;
    }

    mergeLocationsWithConfig(locations, config: Configuration) {
        locations.forEach(location => {
            if (config.config.hasOwnProperty(location.id)) {
                location.content = this.getContentForVenue(config, location.id);
            } else {
                location.content = null
            }

            if (location.hasOwnProperty('children')) {
                this.mergeLocationsWithConfig(location.children, config)
            }
        });
    }

    getContentForVenue(config, venueId) {
        let contentId = config.config[venueId];
        return _.find(this.content, {id: contentId});
    }
}

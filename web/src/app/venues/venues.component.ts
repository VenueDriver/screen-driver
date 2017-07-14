import { Component, OnInit } from '@angular/core';
import {VenuesService} from "./venues.service";
import {Venue} from "./entities/venue";
import {Content} from "../content/content";
import {ContentService} from "../content/content.service";

import * as _ from 'lodash';

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
    isShowAddVenueForm = false;
    isCreateContentMode = false;

    constructor(
        private venuesService: VenuesService,
        private contentService: ContentService
    ) { }

    ngOnInit() {
        this.loadVenues();
        this.loadContent();
        this.subscribeToVenueUpdate();
        this.subscribeToContentUpdate();
    }

    subscribeToVenueUpdate() {
        this.venuesService.getVenueUpdateSubscription()
            .subscribe(() => {
                this.loadVenues();
                this.hideAddVenueForm();
            });
    }

    subscribeToContentUpdate() {
        this.contentService.getContentUpdateSubscription()
            .subscribe(() => this.loadContent());
    }

    loadVenues() {
        this.venuesService.loadVenues().subscribe(response => {
            this.venues = response.json();
            this.venuesTree = this.venuesService.getVenuesForTree(this.venues);

            //This is temporary solution until we create priority hierarchy
            if (!this.config) {
                _initEmptyConfig.call(this);
            }
            this.mergeLocationsWithConfig(this.venues, this.config);
        });

        function _initEmptyConfig() {
            this.config = new Configuration();
            this.config.name = '';
            this.config.config = {};
        }
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

    toggleCreateContentMode(createContentMode: boolean) {
        this.isCreateContentMode = createContentMode;
    }
}

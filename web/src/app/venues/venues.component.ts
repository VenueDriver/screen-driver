import {Component, OnInit} from '@angular/core';
import {VenuesService} from "./venues.service";
import {Venue} from "./entities/venue";
import {Content} from "../content/content";
import {ContentService} from "../content/content.service";
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

    constructor(
        private venuesService: VenuesService,
        private treeViewService: VenuesTreeViewService,
        private contentService: ContentService,
        private configStateHolderService: ConfigStateHolderService,
    ) { }

    ngOnInit() {
        this.loadVenues();
        this.loadContent();
        this.subscribeToVenueUpdate();
        this.subscribeToContentUpdate();
        this.configStateHolderService.getCurrentConfig().subscribe(config => {
            this.config = config;
            this.mergeLocationsWithConfig(this.venues, this.config);
        });
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

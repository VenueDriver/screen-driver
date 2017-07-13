import { Component, OnInit } from '@angular/core';
import {VenuesService} from "./venues.service";
import {Venue} from "./entities/venue";
import {Content} from "../content/content";

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
        private venuesService: VenuesService
    ) { }

    ngOnInit() {
        this.loadVenues();
        this.loadContent();
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

    update() {
        this.hideAddVenueForm();
        this.loadVenues();
    }

    toggleCreateContentMode(createContentMode: boolean) {
        this.isCreateContentMode = createContentMode;
    }
}

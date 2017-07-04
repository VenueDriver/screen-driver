import { Component, OnInit } from '@angular/core';
import {VenuesService} from "./venues.service";
import {Venue} from "./entities/venue";
import {Content} from "../content/content";
import {NotificationService} from "../notifications/notification.service";
import {VenuesTreeViewService} from "./venues-tree-view/venues-tree-view.service";

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
    contentList: any;
    isShowAddVenueForm = false;

    constructor(
        private venuesService: VenuesService,
        private treeViewService: VenuesTreeViewService,
        private notificationService: NotificationService
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
            .subscribe(content => {
                this.content = content;
                this.contentList = this.venuesService.initContentListForDropdown(this.content);
            });
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
                error => this.handleError('An error occurred while saving new venue'));
    }

    handleResponse(response: any) {
        if (response.ok) {
            this.hideAddVenueForm();
        }
        this.loadVenues();
    }

    updateVenue(venueNode: any) {
        this.venuesService.updateVenue(venueNode)
            .subscribe(
                response => this.loadVenues(),
                error => this.handleError('An error occurred while updating configuration'));
    }

    private handleError(message: string) {
        return this.notificationService.showErrorNotificationBar(message);
    }

    getContentListForDropdown(): Array<any> {
        let defaultValue = this.treeViewService.generateDefaultValueForDropdown('Is not specified');
        return [defaultValue, ...this.content];
    }
}

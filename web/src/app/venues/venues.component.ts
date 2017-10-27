import {Component, OnInit} from '@angular/core';
import {VenuesService} from "./venues.service";
import {Venue} from "./entities/venue";
import {Content} from "../content/content";
import {ContentService} from "../content/content.service";

import * as _ from 'lodash';
import {SettingStateHolderService} from "../settings/setting-state-manager/settings-state-holder.service";
import {Setting} from "../settings/entities/setting";
import {SettingMergeTool} from "./setting-merge-tool";

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
    setting: Setting;
    settings: Setting[];
    isShowAddVenueForm = false;
    isCreateContentMode = false;

    constructor(
            private venuesService: VenuesService,
            private contentService: ContentService,
            private settingStateHolderService: SettingStateHolderService
    ) {
    }

    ngOnInit() {
        this.subscribeToVenueUpdate();
        this.subscribeToContentUpdate();
        this.subscribeToCurrentSettingUpdate();
        this.subscribeToSettingsUpdate();
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

    subscribeToCurrentSettingUpdate() {
        this.settingStateHolderService.getCurrentSetting().subscribe(setting => {
            if (!setting) {
                let mergedSetting = this.mergeSettings();
                this.settingStateHolderService.changeCurrentSetting(mergedSetting);
                return;
            }

            this.setting = setting;
            this.mergeLocationsWithConfig(this.venues, this.setting);
        });
    }

    subscribeToSettingsUpdate() {
        this.settingStateHolderService.getAllSettings()
            .subscribe(settings => this.settings = settings);
    }

    loadVenues() {
        this.venuesService.loadVenues().subscribe(venues => {
            this.venues = venues;
            this.venuesTree = this.venuesService.getVenuesForTree(this.venues);

            if (!this.setting) {
                this.setting = this.mergeSettings();
            }
            this.mergeLocationsWithConfig(this.venues, this.setting);
        });

    }

    mergeSettings() {
        return SettingMergeTool
            .startMerging()
            .setSettings(this.settings)
            .setPriorities(this.settingStateHolderService.getPriorityTypes())
            .mergeSettings();
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

    mergeLocationsWithConfig(locations: any, setting: Setting) {
        _.forEach(locations, location => {
            this.defineContentForLocation(location, setting);
            if (location.hasOwnProperty('children')) {
                this.mergeLocationsWithConfig(location.children, setting);
            }
        });
    }

    defineContentForLocation(location: any, setting: Setting) {
        if (setting && setting.config.hasOwnProperty(location.id)) {
            location.content = this.getContentForVenue(setting, location.id);
        } else {
            location.content = null;
        }
    }

    getContentForVenue(setting: Setting, venueId: string) {
        let contentId = setting.config[venueId];
        return _.find(this.content, {id: contentId});
    }

    getCurrentSettingForEditForm() {
        return this.setting.id ? this.setting : null;
    }
}

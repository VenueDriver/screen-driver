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
    settings: Configuration[];
    isShowAddVenueForm = false;
    isCreateContentMode = false;

    constructor(private venuesService: VenuesService,
                private treeViewService: VenuesTreeViewService,
                private contentService: ContentService,
                private configStateHolderService: ConfigStateHolderService,) {
    }

    ngOnInit() {
        this.loadVenues();
        this.loadContent();
        this.subscribeToVenueUpdate();
        this.subscribeToContentUpdate();
        this.configStateHolderService.getCurrentConfig().subscribe(config => {
            if (!config) {
                let mergedConfig = this.mergeConfigurations(this.settings);
                this.configStateHolderService.changeCurrentConfig(mergedConfig);
                return
            }

            this.config = config;
            this.mergeLocationsWithConfig(this.venues, this.config);
        });

        this.configStateHolderService.getAllConfigs().subscribe(settings => this.settings = settings)
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

            if (!this.config) {
                this.initMergedConfig();
            }
            this.mergeLocationsWithConfig(this.venues, this.config);
        });

    }

    initMergedConfig() {
        this.config = this.mergeConfigurations(this.settings);
    }

    private mergeConfigurations(settings) {
        let mergedConfig = new Configuration();
        let enabledSettings = settings.filter((setting => setting.enabled));

        enabledSettings.forEach(setting => {
            for (let instruction in setting.config) {
                if (mergedConfig.config.hasOwnProperty(instruction)) {
                    mergedConfig.config[instruction] = this.resolveSettingConflict(instruction)
                } else {
                    mergedConfig.config[instruction] = setting.config[instruction];
                }
            }
        });
        return mergedConfig;
    }

    resolveSettingConflict(instruction) {
        let conflictedSettings = this.settings.filter(setting => setting.enabled && setting.config.hasOwnProperty(instruction));
        let priorities = this.configStateHolderService.getPriorityTypes();
        let prioritySetting = this.getMostPrioritySetting(conflictedSettings, priorities);
        return prioritySetting.config[instruction];
    }

    private getMostPrioritySetting(conflictedSettings: Configuration[], priorities) {
        let theMostPrioritySetting = null;
        conflictedSettings.forEach(setting => {
            if (!theMostPrioritySetting) {
                theMostPrioritySetting = setting;
                return;
            }

            let settingPriority = _getPriorityIndex(setting.priority);
            let priorityIndex = _getPriorityIndex(theMostPrioritySetting.priority);
            if (settingPriority > priorityIndex) {
                theMostPrioritySetting = setting;
            }
        });

        return theMostPrioritySetting;

        function _getPriorityIndex(priorityId) {
            let priority = priorities.find(element => element.id == priorityId);
            return priorities.indexOf(priority);
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

    mergeLocationsWithConfig(locations, config: Configuration) {
        locations.forEach(location => {
            if (config && config.config.hasOwnProperty(location.id)) {
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

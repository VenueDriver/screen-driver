import { Injectable } from '@angular/core';
import {VenuesTreeViewService} from "../venues-tree-view/venues-tree-view.service";
import {VenuesService} from "../venues.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {Content} from "../../content/content";
import {ContentService} from "../../content/content.service";
import {Venue} from "../entities/venue";
import {ConfigurationsService} from "../../configurations/configurations.service";
import {Configuration} from "../../configurations/entities/configuration";
import {ConfigStateHolderService} from "../../configurations/configuration-state-manager/config-state-holder.service";

import * as _ from 'lodash';

@Injectable()
export class EditTreeViewNodeFormService {

    constructor(
        private treeViewService: VenuesTreeViewService,
        private venuesService: VenuesService,
        private contentService: ContentService,
        private configService: ConfigurationsService,
        private configStateHolderService: ConfigStateHolderService
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

    getVenueId(node: any) {
        let parentNode = node.parent;
        switch (node.level) {
            case 1: return node.data.id;
            case 2: return parentNode.data.id;
            default: return parentNode.parent.data.id;
        }
    }

    findNewNodeId(updatedVenue: Venue, node: any): string {
        if (!node) {
            return updatedVenue.id;
        }
        if (node.level == 2) {
            return this.findNodeIdByName(updatedVenue.screen_groups, node);
        }
        let group = _.find(updatedVenue.screen_groups, group => group.id === node.parent.data.id);
        return this.findNodeIdByName(group.screens, node);
    }

    findNodeIdByName(items: any, node: any): string {
        let item = _.find(items, item => item.name === node.data.name);
        return item.id;
    }

    getConfigToUpdate(currentConfig: Configuration, nodeData: any) {
        let configToUpdate = _.clone(currentConfig);
        console.log(currentConfig)
        configToUpdate.config[nodeData.id] = nodeData.content.id;
        return configToUpdate;
    }

    updateConfig(config: Configuration) {
        this.configService.updateConfiguration(config)
            .subscribe(response => this.configStateHolderService.reloadConfigs());
    }
}
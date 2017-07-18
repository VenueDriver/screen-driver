import { Injectable } from '@angular/core';
import {VenuesTreeViewService} from "../venues-tree-view/venues-tree-view.service";
import {VenuesService} from "../venues.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {Content} from "../../content/content";
import {ContentService} from "../../content/content.service";
import {Venue} from "../entities/venue";
import {SettingsService} from "../../settings/settings.service";
import {Setting} from "../../settings/entities/setting";
import {SettingStateHolderService} from "../../settings/setting-state-manager/settings-state-holder.service";
import {NotificationService} from "../../notifications/notification.service";

import * as _ from 'lodash';

@Injectable()
export class EditTreeViewNodeFormService {

    constructor(
        private treeViewService: VenuesTreeViewService,
        private venuesService: VenuesService,
        private contentService: ContentService,
        private settingsService: SettingsService,
        private settingStateHolderService: SettingStateHolderService,
        private notificationService: NotificationService
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

    getSettingToUpdate(currentSetting: Setting, nodeData: any) {
        let settingToUpdate = _.clone(currentSetting);
        if (!_.isEmpty(nodeData.content)) {
            settingToUpdate.config[nodeData.id] = nodeData.content.id;
        } else {
            this.removeNodeFromConfig(settingToUpdate, nodeData.id);
        }
        return settingToUpdate;
    }

    removeNodeFromConfig(setting: Setting, nodeId: string) {
        delete setting.config[nodeId];
    }

    updateSetting(setting: Setting) {
        this.settingsService.updateSetting(setting)
            .subscribe(
                response => this.settingStateHolderService.reloadSetting(),
                error => this.notificationService.showErrorNotificationBar('Unable to perform setting update operation')
            );
    }
}
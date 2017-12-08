import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EditTreeViewNodeFormService} from "./edit-tree-view-node-form.service";
import {Content} from "../../../content/content";
import {NotificationService} from "../../../shared/notifications/notification.service";

import * as _ from 'lodash';
import {Venue} from "../../../core/entities/venue";
import {Setting} from "../../../settings/entities/setting";
import {SettingStateHolderService} from "../../../core/setting-state-manager/settings-state-holder.service";

@Component({
    selector: 'edit-tree-view-node-form',
    templateUrl: 'edit-tree-view-node-form.component.html',
    styleUrls: ['edit-tree-view-node-form.component.sass'],
    providers: [EditTreeViewNodeFormService]
})
export class EditTreeViewNodeFormComponent implements OnInit {

    @Input() currentSetting: Setting;
    @Input() settings: Setting[];
    @Input() venues: Array<any>;
    @Input() content: Array<Content>;
    @Input('currentNode') set componentModel(currentNode: any) {
        this.setUpComponentModel(currentNode);
    };

    @Input() contentUrlPlaceholder = 'Default URL';

    @Output() cancel = new EventEmitter();
    @Output() createContent = new EventEmitter();

    node: any;
    nodeData: any;
    originalNodeData: any;
    isFormValid: boolean;
    createContentMode = false;
    removingMode = false;
    contentChanged = false;
    currentVenueId: string;
    updatedVenue: Venue;
    isRequestPerforming: boolean = false;

    constructor(
        private editFormService: EditTreeViewNodeFormService,
        private notificationService: NotificationService,
        private settingStateHolderService: SettingStateHolderService,
    ) { }

    ngOnInit() {
        let configChangedSubscription = this.settingStateHolderService.getCurrentSetting().subscribe(() => {
            configChangedSubscription.unsubscribe();
            this.cancel.emit(this.node);
        })
    }

    setUpComponentModel(node: any) {
        this.isFormValid = false;
        this.nodeData = {name: ''};
        if (node) {
            this.node = node;
            this.originalNodeData = _.clone(node.data);
            this.nodeData = node.data;
            this.isFormValid = !!this.nodeData.name;
            this.currentVenueId = this.editFormService.getVenueId(node);
        }
    }

    isInputInvalid(): boolean {
        return this.isNodeHasName() && !this.isFormValid;
    }

    getValidationMessageForNodeName(): string {
        return this.editFormService.getValidationMessageForNodeName(this.node);
    }

    getValidationMessageForContentShortName(): string {
        if (!Content.isShortNameValid(this.nodeData.content)) {
            return `Short name must contains at least ${Content.MIN_FIELD_LENGTH} characters`;
        }
        return `Short name must be unique`;
    }

    getValidationMessageForContentUrl(): string {
        return `URL is invalid`;
    }

    getNameInputPlaceholder(): string {
        let nodeLevelName = this.editFormService.getNodeLevelName(this.node);
        return `${nodeLevelName} name`;
    }

    getNodeName(): string {
        let nodeLevelName = this.editFormService.getNodeLevelName(this.node).toLowerCase();
        return `${nodeLevelName} ${this.originalNodeData.name}`;
    }

    private formatContentUrl() {
        let url = this.nodeData.content.url;
        this.nodeData.content.url = this.getUrlWithProtocol(url);
    }

    validateForm() {
        this.nodeData.name = this.nodeData.name.trim();
        this.isFormValid = this.isNodeNameValid() && this.isContentShortNameValid() && this.isContentUrlValid();
    }

    isNodeNameValid(): boolean {
        return this.isNodeHasName() && this.isNodeNameUnique();
    }

    isNodeHasName(): boolean {
        return !_.isEmpty(this.nodeData.name);
    }

    isNodeNameUnique(): boolean {
        if (this.hasParentNode()) {
            let siblings = this.node.parent.data.children;
            return !this.hasSiblingWithTheSameName(siblings);
        }
        return this.isVenueNameUnique();
    }

    hasParentNode(): boolean {
        return this.node && this.node.parent;
    }

    hasSiblingWithTheSameName(siblings): boolean {
        return !!_.find(siblings, s => s.id !== this.nodeData.id && s.name === this.nodeData.name);
    }

    isVenueNameUnique(): boolean {
        return !_.includes(_.map(this.venues, venue => venue.name), this.nodeData.name);
    }

    isContentShortNameValid(): boolean {
        return !this.createContentMode ||
               Content.isShortNameValid(this.nodeData.content) && this.isContentShortNameUnique(this.nodeData.content);
    }

    isContentShortNameUnique(content: Content): boolean {
        content.short_name = content.short_name.trim();
        return !_.find(this.content, c => c.short_name === content.short_name);
    }

    isContentUrlValid(): boolean {
        return !this.createContentMode || Content.isUrlValid(this.nodeData.content);
    }

    getDropdownValue(): string {
        return this.nodeData.content ? this.nodeData.content.short_name : '';
    }

    setNodeContent(content) {
        this.contentChanged = true;
        if (!_.isEmpty(content.id)) {
            this.nodeData.content = content;
        } else {
            this.clearNodeContent();
        }
    }

    clearNodeContent() {
        this.nodeData.content = null;
    }

    performCancel(event: any) {
        this.removeEditableNode();
        this.stopClickPropagation(event);
        this.cancel.emit(this.node);
    }

    private removeEditableNode() {
        this.settingStateHolderService.disableCurrentSettingEditMode();
    }

    performSubmit(event: any) {
        this.stopClickPropagation(event);
        if (!this.isFormValid) return;
        if (this.createContentMode) {
            this.createContentBeforeUpdateVenue();
        } else {
            this.updateVenues();
        }
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

    createContentBeforeUpdateVenue() {
        this.formatContentUrl();

        this.editFormService.saveNewContent(this.nodeData.content)
            .subscribe(
                content => this.handleCreateContentResponse(content),
                error => this.notificationService.showErrorNotificationBar('Unable to perform save operation')
            );
    }

    handleCreateContentResponse(content: any) {
        this.editFormService.pushContentUpdateEvent();
        this.nodeData.content = content;
        this.updateVenues();
    }

    updateVenues() {
        this.isRequestPerforming = true;
        if (this.currentVenueId && this.wasNodeChanged()) {
            this.updateSingleVenue();
        } else if (!this.currentVenueId) {
            this.addNewVenue();
        } else {
            this.disableEditMode();
            this.updateSetting();
        }

    }

    wasNodeChanged() {
        return this.nodeData.name !== this.originalNodeData.name;
    }

    addNewVenue() {
        this.editFormService.saveVenue(this.nodeData)
            .subscribe(
                response => this.handleVenueListUpdateResponse(response),
                error => this.handleError('Unable to perform save operation')
            );
    }

    updateSingleVenue() {
        let venueToUpdate = _.find(this.venues, venue => venue.id === this.currentVenueId);
        this.editFormService.updateVenue(venueToUpdate)
            .subscribe(
                venue => {
                    this.handleVenueListUpdateResponse(venue);
                    this.isRequestPerforming = false;
                    },
                error => {
                    this.handleError('Unable to update setting');
                    this.isRequestPerforming = false;
                }
            );
    }

    handleVenueListUpdateResponse(venue: Venue) {
        this.updatedVenue = venue;
        this.disableEditMode();
        this.updateSetting();
    }

    disableEditMode() {
        this.removeEditableNode();
        this.editFormService.pushVenueUpdateEvent();
        this.createContentMode = false;
    }

    enableCreateContentMode(event) {
        this.nodeData.content = {short_name: event.short_name};
        this.createContentMode = true;
        this.contentChanged = true;
        this.isFormValid = false;
        this.createContent.emit(this.createContentMode);
    }

    showValidationMessageForNodeName(): boolean {
        return this.nodeData.name && !this.isNodeNameValid();
    }

    showValidationMassageForShortName(): boolean {
        return this.nodeData.content.short_name && !this.isContentShortNameValid();
    }

    showValidationMessageForUrl(): boolean {
        return this.nodeData.content.url && !this.isContentUrlValid();
    }

    handleError(errorMessage: string) {
        this.notificationService.showErrorNotificationBar(errorMessage);
    }

    updateSetting() {
        if (this.contentChanged) {
            this.defineNodeId();
            let settingToUpdate = this.editFormService.getSettingToUpdate(this.currentSetting, this.nodeData);
            this.editFormService.defineSettingRevision(settingToUpdate, this.settings);
            this.editFormService.updateSetting(settingToUpdate);
            this.contentChanged = false;
        }
    }

    defineNodeId() {
        if (!this.nodeData.id) {
            this.nodeData.id = this.editFormService.findNewNodeId(this.updatedVenue, this.node);
        }
    }

    isAbleToSetUrl() {
        return !this.createContentMode && this.currentSetting;
    }

    enableRemovingMode(event: any) {
        this.stopClickPropagation(event);
        this.removingMode = true;
    }

    cancelRemoving(event: any) {
        this.stopClickPropagation(event);
        this.removingMode = false;
    }

    performRemoving(event: any) {
        this.removeEditableNode();
        this.stopClickPropagation(event);
        this.editFormService.deleteItem(this.node, this.currentSetting);
    }

    private getUrlWithProtocol(url) {
        let httpMarker = "http://";
        return this.hasURLProtocolMarker(url) ? url : httpMarker + url;
    }

    private hasURLProtocolMarker(url): boolean {
        let httpUrlTemplate = /http(.+?)\/\//;

        return !!url.match(httpUrlTemplate);
    }

    getSpinnerLoadingText() {
        return `Saving ${this.editFormService.getNodeLevelName(this.node).toLowerCase()}...`;
    }
}

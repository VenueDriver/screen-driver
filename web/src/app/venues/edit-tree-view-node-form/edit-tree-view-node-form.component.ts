import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EditTreeViewNodeFormService} from "./edit-tree-view-node-form.service";
import {Content} from "../../content/content";
import {NotificationService} from "../../notifications/notification.service";

import * as _ from 'lodash';
import {Venue} from "../entities/venue";
import {Configuration} from "../../configurations/entities/configuration";

@Component({
    selector: 'edit-tree-view-node-form',
    templateUrl: 'edit-tree-view-node-form.component.html',
    styleUrls: ['edit-tree-view-node-form.component.sass'],
    providers: [EditTreeViewNodeFormService]
})
export class EditTreeViewNodeFormComponent {

    @Input() currentConfig: Configuration;
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
    isFormValid: boolean;
    createContentMode = false;
    contentChanged = false;
    currentVenueId: string;
    updatedVenue: Venue;

    constructor(
        private editFormService: EditTreeViewNodeFormService,
        private notificationService: NotificationService
    ) { }

    setUpComponentModel(node: any) {
        this.isFormValid = false;
        this.nodeData = {name: ''};
        if (node) {
            this.node = node;
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
        this.stopClickPropagation(event);
        this.cancel.emit(this.node);
    }

    performSubmit(event: any) {
        this.stopClickPropagation(event);
        if (this.createContentMode) {
            this.createContentBeforeUpdateVenue();
        } else {
            this.updateVenueList();
        }
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

    createContentBeforeUpdateVenue() {
        this.editFormService.saveNewContent(this.nodeData.content)
            .subscribe(
                content => this.handleCreateContentResponse(content),
                error => this.notificationService.showErrorNotificationBar('Unable to perform save operation')
            );
    }

    handleCreateContentResponse(content: any) {
        this.editFormService.pushContentUpdateEvent();
        this.nodeData.content = content;
        this.updateVenueList();
    }

    updateVenueList() {
        if (this.currentVenueId) {
            this.updateSingleVenue();
        } else {
            this.addNewVenue();
        }
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
                response => this.handleVenueListUpdateResponse(response),
                error => this.handleError('Unable to update configuration')
            );
    }

    handleVenueListUpdateResponse(response: any) {
        this.updatedVenue = response.json();
        this.editFormService.pushVenueUpdateEvent();
        this.createContentMode = false;
        if (this.contentChanged) {
            this.updateConfig();
        }
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

    updateConfig() {
        this.defineNodeId();
        let configToUpdate = this.editFormService.getConfigToUpdate(this.currentConfig, this.nodeData);
        this.editFormService.updateConfig(configToUpdate);
        this.contentChanged = false;
    }

    defineNodeId() {
        if (!this.nodeData.id) {
            this.nodeData.id = this.editFormService.findNewNodeId(this.updatedVenue, this.node);
        }
    }

    isAbleToSetUrl() {
        console.log(this.currentConfig)
        return !this.createContentMode && this.currentConfig;
    }
}
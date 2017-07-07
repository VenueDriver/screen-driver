import {Component, EventEmitter, Input, Output} from '@angular/core';
import {VenuesService} from "../venues.service";
import {VenuesTreeViewService} from "../venues-tree-view/venues-tree-view.service";
import {Content} from "../../content/content";

import * as _ from 'lodash';

@Component({
    selector: 'edit-tree-view-node-form',
    templateUrl: 'edit-tree-view-node-form.component.html',
    styleUrls: ['edit-tree-view-node-form.component.sass']
})
export class EditTreeViewNodeFormComponent {

    @Input() venues: Array<any>;
    @Input() content: Array<Content>;
    @Input('currentNode') set componentModel(currentNode: any) {
        this.setUpComponentModel(currentNode);
    };

    @Input() contentUrlPlaceholder = 'Default URL';

    @Output() submit = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() createContent = new EventEmitter();

    node: any;
    nodeData: any;
    isFormValid: boolean;
    createContentMode = false;

    constructor(
        private venueService: VenuesService,
        private treeViewService: VenuesTreeViewService
    ) { }

    setUpComponentModel(node: any) {
        this.isFormValid = false;
        this.nodeData = {name: ''};
        if (node) {
            this.node = node;
            this.nodeData = node.data;
            this.isFormValid = !!this.nodeData.name;
        }
    }

    isInputInvalid(): boolean {
        return this.isNodeHasName() && !this.isFormValid;
    }

    getValidationMessageForNodeName(): string {
        let nodeLevelName = this.getNodeLevelName();
        return this.venueService.getValidationMessage(nodeLevelName);
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
        let nodeLevelName = this.getNodeLevelName();
        return `${nodeLevelName} name`;
    }

    getNodeLevelName(): string {
        return this.node ? this.treeViewService.getNodeLevelName(this.node.level) : 'Venue';
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
        return !_.find(this.content, c => c.short_name === content.short_name);
    }

    isContentUrlValid(): boolean {
        return !this.createContentMode || Content.isUrlValid(this.nodeData.content);
    }

    getDropdownValue(): string {
        return this.nodeData.content ? this.nodeData.content.short_name : '';
    }

    setNodeContent(content) {
        if (!_.isEmpty(content.id)) {
            this.nodeData.content = content;
            this.nodeData.content_id = content.id;
        } else {
            this.clearNodeContent();
        }
    }

    clearNodeContent() {
        this.nodeData.content = null;
        this.nodeData.content_id = null;
    }

    performCancel(event: any) {
        this.stopClickPropagation(event);
        this.cancel.emit(this.node);
    }

    performSubmit(event: any) {
        this.stopClickPropagation(event);
        this.submit.emit(this.node ? this.node : this.nodeData);
        this.createContentMode = false;
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

    add(event) {
        this.nodeData.content = {short_name: event.short_name};
        this.createContentMode = true;
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
}
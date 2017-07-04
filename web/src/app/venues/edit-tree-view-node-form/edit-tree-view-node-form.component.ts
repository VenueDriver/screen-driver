import {Component, OnInit, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {VenuesService} from "../venues.service";
import {VenuesTreeViewService} from "../venues-tree-view/venues-tree-view.service";
import {Content} from "../../content/content";

import * as _ from 'lodash';

@Component({
    selector: 'edit-tree-view-node-form',
    templateUrl: 'edit-tree-view-node-form.component.html',
    styleUrls: ['edit-tree-view-node-form.component.sass']
})
export class EditTreeViewNodeFormComponent implements OnInit {

    @Input() venues: Array<any>;
    @Input() content: Array<Content>;
    @Input('currentNode') set componentModel(currentNode: any) {
        this.setUpComponentModel(currentNode);
    };

    @Input() contentUrlPlaceholder = 'Default URL';

    @Output() submit = new EventEmitter();
    @Output() cancel = new EventEmitter();

    node: any;
    nodeData: any;
    isFormValid: boolean;

    constructor(
        private renderer: Renderer2,
        private venueService: VenuesService,
        private treeViewService: VenuesTreeViewService
    ) { }

    ngOnInit() {
        this.renderer.selectRootElement('#nodeName').focus();
    }

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

    isNodeHasName(): boolean {
        return !_.isEmpty(this.nodeData.name);
    }

    getValidationMessage(): string {
        let nodeLevelName = this.getNodeLevelName();
        return this.venueService.getValidationMessage(nodeLevelName);
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
        this.isFormValid = this.isNodeHasName() && this.isNodeNameUnique();
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

    isVenueNameUnique() {
        return !_.includes(_.map(this.venues, venue => venue.name), this.nodeData.name);
    }

    hasSiblingWithTheSameName(siblings): boolean {
        return !!_.find(siblings, s => {
            return s.id !== this.nodeData.id &&
                s.name === this.nodeData.name;
        });
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

    private clearNodeContent() {
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
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

}
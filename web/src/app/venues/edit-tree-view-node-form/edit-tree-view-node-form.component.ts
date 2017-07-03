import {Component, OnInit, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {VenuesService} from "../venues.service";

import * as _ from 'lodash';
import {VenuesTreeViewService} from "../venues-tree-view/venues-tree-view.service";

@Component({
    selector: 'edit-tree-view-node-form',
    templateUrl: 'edit-tree-view-node-form.component.html'
})
export class EditTreeViewNodeFormComponent implements OnInit {

    @Input() venues: Array<any>;
    @Input() content: Array<any>;
    @Input('currentNode') set currentNode(currentNode: any) {
        this.setUpComponentModel(currentNode);
    };

    @Output() submit = new EventEmitter();
    @Output() cancel = new EventEmitter();

    node: any;
    nodeData: any;
    isFormValid;
    contentUrlPlaceholder = 'Default URL';

    constructor(
        private renderer: Renderer2,
        private venueService: VenuesService,
        private treeViewService: VenuesTreeViewService
    ) { }

    ngOnInit() {
        this.renderer.selectRootElement('#nodeName').focus();
    }

    setUpComponentModel(node: any) {
        if (node) {
            this.node = node;
            this.nodeData = node.data;
            this.isFormValid = !!this.nodeData.name;
        } else {
            this.isFormValid = false;
            this.nodeData = {
                name: ''
            }
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
        if (this.hasParentNode()) {
            let siblings = this.node.parent.data.children;
            this.isFormValid = this.isNodeHasName() && !this.hasSiblingWithTheSameName(siblings);
        } else {
            this.isFormValid = this.isNodeHasName() && this.isNodeNameUnique();
        }
    }

    hasParentNode(): boolean {
        return this.node && this.node.parent;
    }

    isNodeNameUnique() {
        return !_.includes(_.map(this.venues, venue => venue.name), this.nodeData.name);
    }

    hasSiblingWithTheSameName(siblings): boolean {
        return !!_.find(siblings, s => {
            return s.id !== this.nodeData.id &&
                s.name === this.nodeData.name;
        });
    }

    getDropdownValue(): string {
        return this.nodeData.content ? this.nodeData.content.short_name : this.contentUrlPlaceholder;
    }

    setNodeContent(content) {
        if (!_.isEmpty(content.id)) {
            this.nodeData.content = content;
            this.nodeData.content_id = content.id;
        } else {
            this.nodeData.content = null;
            this.nodeData.content_id = null;
        }
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
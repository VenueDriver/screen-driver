import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
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
        this.node = currentNode;
        this.nodeData = currentNode.data;
        this.isFormValid = !!this.nodeData.name;
    };

    @Output() submit = new EventEmitter();
    @Output() cancel = new EventEmitter();

    node: any;
    nodeData: any;
    isFormValid;
    contentUrlPlaceholder = 'Default URL';

    constructor(
        private venueService: VenuesService,
        private treeViewService: VenuesTreeViewService
    ) { }

    ngOnInit() { }

    isInputInvalid(): boolean {
        return this.isCurrentNodeHasName() && !this.isFormValid;
    }

    isCurrentNodeHasName(): boolean {
        return !_.isEmpty(this.nodeData.name)
    }

    getValidationMessage(): string {
        let item = this.treeViewService.getNodeLevelName(this.node.level);
        return this.venueService.getValidationMessage(item);
    }

    getNameInputPlaceholder(): string {
        let nodeLevelName = this.treeViewService.getNodeLevelName(this.node.level);
        return `${nodeLevelName} name`;
    }

    validateForm() {
        let siblings = this.node.parent.data.children;
        this.nodeData.name = this.nodeData.name.trim();
        this.isFormValid = this.isCurrentNodeHasName() && !this.hasSiblingWithTheSameName(siblings);
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
        this.submit.emit(this.node);
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

}
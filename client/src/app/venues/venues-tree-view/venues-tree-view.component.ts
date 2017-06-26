import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import {VenuesTreeViewService} from "./venues-tree-view.service";
import {ITreeOptions} from "angular-tree-component/dist/defs/api";
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component/dist/models/tree-options.model";
import {VenuesService} from "../venues.service";
import {TreeComponent} from "angular-tree-component/dist/angular-tree-component";

import * as _ from 'lodash';

@Component({
    selector: 'venues-tree-view',
    templateUrl: 'venues-tree-view.component.html',
    styleUrls: ['./venues-tree-view.component.sass'],
    providers: [
        VenuesTreeViewService,
        VenuesService
    ]
})
export class VenuesTreeViewComponent implements OnInit {

    @Input() venues: any;
    @Input() content: any;
    @Output() update = new EventEmitter();

    @ViewChild(TreeComponent)
    private tree: TreeComponent;

    contentUrlPlaceholder = 'Specify content URL';
    options: any;
    actionMapping: any;
    currentNode: any;
    originalNode: any;
    isFormValid = false;

    constructor(
        private venuesTreeViewService: VenuesTreeViewService,
        private venuesService: VenuesService
    ) { }

    ngOnInit() {
        this.actionMapping = this.getActionMapping();
        this.options = this.getTreeViewOptions();
    }

    getTreeViewOptions(): ITreeOptions {
        return {
            actionMapping: this.actionMapping,
        }
    }

    getActionMapping(): IActionMapping {
        return {
            mouse: {
                click: TREE_ACTIONS.TOGGLE_EXPANDED
            }
        }
    }

    hasContentInfo(node: any): boolean {
        return node.data.content;
    }

    getContentShortName(node: any): string {
        if (node.data.content) {
            return node.data.content.short_name;
        }
    }

    getContentUrl(node: any): string {
        if (node.data.content) {
            return node.data.content.url;
        }
    }

    addNewNode(event, node) {
        this.expandIfCollapsed(event, node);
        if (!node.data.children) {
            node.data.children = [];
        }
        node.data.children.push(this.createBlankNode());
        this.tree.treeModel.update();
    }

    expandIfCollapsed(event, node) {
        if (node.isExpanded) {
            event.stopPropagation();
        }
    }

    createBlankNode(): any {
        this.currentNode = {
            id: '',
            name: ''
        };
        return this.currentNode;
    }

    clearCurrentNode() {
        this.currentNode = {};
    }

    isCurrentNode(node: any) {
        return _.isEqual(this.currentNode, node.data);
    }

    isAllowToAddChild(node: any) {
        return node.level < 3 && this.isAllowToEditNode();
    }

    isAllowToEditNode() {
        return _.isEmpty(this.currentNode);
    }

    performCancel(node: any) {
        if (!node.data.id) {
            this.removeBlankNode(node);
        } else {
            node.data = this.originalNode;
        }
        this.clearCurrentNode();
    }

    removeBlankNode(node: any) {
        let parentNodeData = node.parent.data;
        _.pull(parentNodeData.children, this.currentNode);
        this.tree.treeModel.update();
    }

    validateForm(node: any) {
        let siblings = node.parent.data.children;
        node.data.name = node.data.name.trim();
        this.isFormValid = !_.isEmpty(this.currentNode.name) && !this.hasSiblingWithTheSameName(siblings, node);
    }

    hasSiblingWithTheSameName(siblings, node): boolean {
        return !!_.find(siblings, s => {
            return s.id !== node.data.id &&
                   s.name === node.data.name;
        });
    }

    performSubmit(node: any) {
        let venueId = this.getVenueId(node);
        let venueToUpdate = _.find(this.venues, venue => venue.id === venueId);
        this.update.emit(venueToUpdate);
        this.clearCurrentNode();
    }

    getVenueId(node: any) {
        let parentNode = node.parent;
        switch (node.level) {
            case 1: return node.data.id;
            case 2: return parentNode.data.id;
            default: return parentNode.parent.data.id;
        }
    }

    setNodeContent(content) {
        if (!_.isEmpty(content.id)) {
            this.currentNode.content = content;
            this.currentNode.content_id = content.id;
        } else {
            this.currentNode.content = null;
            this.currentNode.content_id = null;
        }
    }

    editNode(event: any, node: any) {
        event.stopPropagation();
        this.currentNode = node.data;
        this.originalNode = _.clone(node.data);
    }

    getDropdownValue(): string {
        return this.currentNode.content ? this.currentNode.content.short_name : this.contentUrlPlaceholder;
    }

}

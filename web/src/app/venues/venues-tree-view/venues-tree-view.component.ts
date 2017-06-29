import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import {ITreeOptions} from "angular-tree-component/dist/defs/api";
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component/dist/models/tree-options.model";
import {TreeComponent} from "angular-tree-component/dist/angular-tree-component";
import {VenuesService} from "../venues.service";

import * as _ from 'lodash';

@Component({
    selector: 'venues-tree-view',
    templateUrl: 'venues-tree-view.component.html',
    styleUrls: ['./venues-tree-view.component.sass']
})
export class VenuesTreeViewComponent implements OnInit {

    @Input() venues: Array<any>;
    @Input() content: Array<any>;
    @Output() update = new EventEmitter();

    @ViewChild(TreeComponent)
    private tree: TreeComponent;

    contentUrlPlaceholder = 'Default URL';
    options: any;
    actionMapping: any;
    currentNode: any;
    originalNode: any;
    isFormValid = false;

    constructor(private venueService: VenuesService) { }

    ngOnInit() {
        this.updateTreeViewOptions();
    }

    updateTreeViewOptions() {
        this.actionMapping = this.getActionMapping();
        this.options = this.getTreeViewOptions();
        this.updateTreeModel();
    }

    updateTreeModel() {
        this.tree.treeModel.update();
    }

    getTreeViewOptions(): ITreeOptions {
        return {
            actionMapping: this.actionMapping,
        }
    }

    getActionMapping(): IActionMapping {
        return {
            mouse: {
                click: this.getMouseClickAction()
            }
        }
    }

    getMouseClickAction() {
        return _.isEmpty(this.currentNode) ? TREE_ACTIONS.TOGGLE_EXPANDED : TREE_ACTIONS.DESELECT;
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
        this.updateTreeModel();
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

    performCancel(event: any, node: any) {
        this.stopClickPropagation(event);
        if (!node.data.id) {
            this.removeBlankNode(node);
        } else {
            this.undoEditing(node);
        }
        this.clearCurrentNode();
        this.updateTreeViewOptions();
    }

    removeBlankNode(node: any) {
        let parentNodeData = node.parent.data;
        _.pull(parentNodeData.children, this.currentNode);
        this.updateTreeModel();
    }

    undoEditing(node: any) {
        let parentNodeData = node.parent.data;
        let nodeIndex = parentNodeData.children.indexOf(this.currentNode);
        _.pull(parentNodeData.children, this.currentNode);
        parentNodeData.children.splice(nodeIndex, 0, this.originalNode);
        this.updateTreeModel();
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

    performSubmit(event: any, node: any) {
        this.stopClickPropagation(event);
        let venueId = this.getVenueId(node);
        let venueToUpdate = _.find(this.venues, venue => venue.id === venueId);
        this.update.emit(venueToUpdate);
        this.clearCurrentNode();
        this.updateTreeViewOptions();
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
        this.stopClickPropagation(event);
        this.currentNode = node.data;
        this.originalNode = _.clone(node.data);
        this.updateTreeViewOptions();
    }

    getDropdownValue(): string {
        return this.currentNode.content ? this.currentNode.content.short_name : this.contentUrlPlaceholder;
    }

    hasChildren(node: any): boolean {
        return node.children && node.children.length > 0;
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

    isInputInvalid(): boolean {
        return !_.isEmpty(this.currentNode.name) && !this.isFormValid;
    }

    getValidationMessage(node: any): string {
        let item: string;
        switch (node.level) {
            case 3:
                item = 'Screen';
                break;
            case 2:
                item = 'Screen group';
                break;
            default:
                item = 'Venue';
        }
        return this.venueService.getValidationMessage(item);
    }
}

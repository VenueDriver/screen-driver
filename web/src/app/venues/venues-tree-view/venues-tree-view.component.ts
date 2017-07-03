import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import {ITreeOptions} from "angular-tree-component/dist/defs/api";
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component/dist/models/tree-options.model";
import {TreeComponent} from "angular-tree-component/dist/angular-tree-component";
import {VenuesTreeViewService} from "./venues-tree-view.service";

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

    options: any;
    actionMapping: any;
    currentNodeData: any;
    originalNodeData: any;
    isFormValid = false;

    constructor(private treeViewService: VenuesTreeViewService) { }

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
        return _.isEmpty(this.currentNodeData) ? TREE_ACTIONS.TOGGLE_EXPANDED : TREE_ACTIONS.DESELECT;
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
        this.currentNodeData = {
            id: '',
            name: ''
        };
        return this.currentNodeData;
    }

    clearCurrentNode() {
        this.currentNodeData = {};
    }

    isCurrentNode(node: any) {
        return _.isEqual(this.currentNodeData, node.data);
    }

    isAllowToAddChild(node: any) {
        return node.level < 3 && this.isAllowToEditNode();
    }

    isAllowToEditNode() {
        return _.isEmpty(this.currentNodeData);
    }

    performCancel(node: any) {
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
        _.pull(parentNodeData.children, this.currentNodeData);
        this.updateTreeModel();
    }

    undoEditing(node: any) {
        let parentNodeData = node.parent.data;
        let nodeIndex = parentNodeData.children.indexOf(this.currentNodeData);
        _.pull(parentNodeData.children, this.currentNodeData);
        parentNodeData.children.splice(nodeIndex, 0, this.originalNodeData);
        this.updateTreeModel();
    }

    validateForm(node: any) {
        let siblings = node.parent.data.children;
        node.data.name = node.data.name.trim();
        this.isFormValid = this.isCurrentNodeHasName() && !this.hasSiblingWithTheSameName(siblings, node);
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

    editNode(event: any, node: any) {
        this.stopClickPropagation(event);
        this.currentNodeData = node.data;
        this.originalNodeData = _.clone(node.data);
        this.updateTreeViewOptions();
    }

    hasChildren(node: any): boolean {
        return node.children && node.children.length > 0;
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

    isCurrentNodeHasName(): boolean {
        return !_.isEmpty(this.currentNodeData.name)
    }

    getAddButtonTitle(node: any): string {
        let title = 'Add new screen';
        return node.level > 1 ? title : `${title} group`;
    }

    getNodeLevelName(node: any): string {
        return this.treeViewService.getNodeLevelName(node.level);
    }

    getPlaceholderForDefaultUrl(node: any): string {
        if (node.level == 1) {
            return 'Content URL is not specified';
        }
        let parentNodeLevelName = this.treeViewService.getNodeLevelName(node.level - 1);
        parentNodeLevelName = parentNodeLevelName.toLowerCase();
        return `Content URL inherited from ${parentNodeLevelName}`;
    }
}
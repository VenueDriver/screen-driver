import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import {ITreeOptions} from "angular-tree-component/dist/defs/api";
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component/dist/models/tree-options.model";
import {KEYS} from "angular-tree-component/dist/constants/keys";
import {TreeComponent} from "angular-tree-component/dist/angular-tree-component";
import {VenuesTreeViewService} from "./venues-tree-view.service";
import {Content} from "../../content/content";

import * as _ from 'lodash';
import {VenuesService} from "../venues.service";

const MAX_DISPLAYING_URL_LENGTH = window.innerWidth > 478 ? 60 : 23;

@Component({
    selector: 'venues-tree-view',
    templateUrl: 'venues-tree-view.component.html',
    styleUrls: ['./venues-tree-view.component.sass']
})
export class VenuesTreeViewComponent implements OnInit {

    @Input() venues: Array<any>;
    @Input() content: Array<Content>;
    @Output() contentChange = new EventEmitter();

    @ViewChild(TreeComponent)
    private tree: TreeComponent;

    options: any;
    actionMapping: any;
    currentNodeData: any;
    originalNodeData: any;
    isFormValid = false;
    isCreateContentMode = false;

    constructor(
        private venuesService: VenuesService,
        private treeViewService: VenuesTreeViewService
    ) { }

    ngOnInit() {
        this.updateTreeViewOptions();
        this.venuesService.getVenueUpdateSubscription().subscribe(() => this.onVenueUpdate());
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
            mouse: {click: this.getMouseClickAction()},
            keys: this.createDefaultActionConfigForKeys()
        }
    }

    getMouseClickAction() {
        return _.isEmpty(this.currentNodeData) ? TREE_ACTIONS.TOGGLE_EXPANDED : TREE_ACTIONS.DESELECT;
    }

    createDefaultActionConfigForKeys() {
        let keyConfig = {};
        _.forEach(KEYS, key => keyConfig[key] = () => {});
        return keyConfig;
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
            return this.getShortUrl(node.data.content);
        }
    }

    getShortUrl(content: Content): string {
        return Content.getShortUrl(content, MAX_DISPLAYING_URL_LENGTH);
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
        this.currentNodeData = {id: '', name: ''};
        return this.currentNodeData;
    }

    clearCurrentNodeDataField() {
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
        this.dismissChanges(node);
        this.clearCurrentNodeDataField();
        this.updateTreeViewOptions();
        this.isCreateContentMode = false;
    }

    dismissChanges(node: any) {
        if (!node.data.id) {
            this.removeBlankNode(node);
        } else {
            this.undoEditing(node);
        }
    }

    removeBlankNode(node: any) {
        let parentNodeData = node.parent.data;
        _.pull(parentNodeData.children, this.currentNodeData);
    }

    undoEditing(node: any) {
        let parentNodeData = node.parent.data;
        let nodeIndex = parentNodeData.children.indexOf(this.currentNodeData);
        _.pull(parentNodeData.children, this.currentNodeData);
        parentNodeData.children.splice(nodeIndex, 0, this.originalNodeData);
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

    onVenueUpdate() {
        this.isCreateContentMode = false;
        this.clearCurrentNodeDataField();
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
        return node.level < 3 && node.children && node.children.length > 0;
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

    isCurrentNodeHasName(): boolean {
        return !_.isEmpty(this.currentNodeData.name);
    }

    getAddButtonTitle(node: any): string {
        let title = 'Add new screen';
        return node.level > 1 ? title : `${title} group`;
    }

    getEditButtonTitle(node: any): string {
        let nodeLevelName = this.treeViewService.getNodeLevelName(node.level);
        return `Edit ${nodeLevelName.toLowerCase()}`;
    }

    getNodeLevelName(node: any): string {
        return this.treeViewService.getNodeLevelName(node.level);
    }

    getPlaceholderForDefaultUrl(node: any): string {
        return this.treeViewService.getPlaceholderForDefaultUrl(node.level);
    }

    toggleCreateContentMode(createContentMode: boolean) {
        this.isCreateContentMode = createContentMode;
    }

    containsLargeForm(node: any): boolean {
        return this.currentNodeData === node.data && this.isCreateContentMode;
    }
}
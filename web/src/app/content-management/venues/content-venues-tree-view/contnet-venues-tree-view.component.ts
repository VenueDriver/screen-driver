import {Component, OnInit, Input, Output, ViewChild, EventEmitter, OnDestroy} from '@angular/core';
import {ITreeOptions} from "angular-tree-component/dist/defs/api";
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component/dist/models/tree-options.model";
import {KEYS} from "angular-tree-component/dist/constants/keys";
import {TreeComponent} from "angular-tree-component/dist/angular-tree-component";
import {Content} from "../../../content/content";
import {VenuesService} from "../venues.service";
import {Setting} from "../../../settings/entities/setting";

import * as _ from 'lodash';
import {SettingStateHolderService} from "../../../settings/setting-state-manager/settings-state-holder.service";
import {VenuesTreeViewService} from "../venues-tree-view/venues-tree-view.service";
import {VenuesTreeViewComponent} from "../venues-tree-view/venues-tree-view.component";

const MAX_DISPLAYING_URL_LENGTH = window.innerWidth > 768 ? 60 : 23;

@Component({
    selector: 'content-venues-tree-view',
    templateUrl: 'content-venues-tree-view.component.html',
    styleUrls: ['./content-venues-tree-view.component.sass']
})
export class ContentVenuesTreeViewComponent implements OnInit, OnDestroy {

    @Input() venues: Array<any>;
    @Input() content: Array<Content>;
    @Output() contentChange = new EventEmitter();

    @ViewChild(VenuesTreeViewComponent)
    private venuesTree: VenuesTreeViewComponent;

    currentSetting: Setting;
    settings: Setting[];
    options: any;
    currentNodeData: any;
    originalNodeData: any;
    isFormValid = false;
    isCreateContentMode = false;

    constructor(
        private venuesService: VenuesService,
        private treeViewService: VenuesTreeViewService,
        private settingStateHolderService: SettingStateHolderService
    ) { }

    ngOnInit() {
        this.venuesService.getVenueUpdateSubscription().subscribe(() => this.onVenueUpdate());
        this.subscribeToCurrentSettingUpdate();
        this.subscribeToSettingsUpdate();
    }

    ngOnDestroy() {
        this.removeEditableNode();
    }

    subscribeToCurrentSettingUpdate() {
        this.settingStateHolderService.getCurrentSetting().subscribe(setting => {
            this.currentSetting = setting;
        });
    }

    subscribeToSettingsUpdate() {
        this.settingStateHolderService.getAllSettings().subscribe(settings => {
            this.settings = settings;
        });
    }

    updateTreeViewOptions() {
        this.venuesTree.updateTreeViewOptions();
    }

    updateTreeModel() {
        this.venuesTree.updateTreeModel();
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

    hasSelectedNode(): boolean {
        return !!this.currentNodeData;
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
        this.removeEditableNode();
    }

    private removeEditableNode() {
        this.treeViewService.removeEditableNode();
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


    onVenueUpdate() {
        this.isCreateContentMode = false;
        this.clearCurrentNodeDataField();
        this.updateTreeViewOptions();
    }

    editNode(event: any, node: any) {
        if (this.currentSetting) {
            this.treeViewService.setEditableNode(node);
        }

        this.stopClickPropagation(event);
        this.currentNodeData = node.data;
        this.originalNodeData = _.clone(node.data);
        this.updateTreeViewOptions();
    }

    getScreensFrom(node: any) {
        let screens = [];
        let data = node.data || node;

        screens = this.getNestedNodes(data);

        return _.flattenDeep(screens);
    }

    getNestedNodes(node) {
        let screens = [];

        if (node.children) {
            screens = _.map(node.children, (n: any) => this.getScreensFrom(n));
        } else {
            screens.push(node);
        }

        return screens;
    }

    hasChildren(node: any): boolean {
        return node.level < 3 && node.children && node.children.length > 0;
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
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

    //form validation
    validateForm(node: any) {
        let siblings = node.parent.data.children;
        node.data.name = node.data.name.trim();
        this.isFormValid = this.isCurrentNodeHasName() && !this.hasSiblingWithTheSameName(siblings, node);
    }

    isCurrentNodeHasName(): boolean {
        return !_.isEmpty(this.currentNodeData.name);
    }

    hasSiblingWithTheSameName(siblings, node): boolean {
        return !!_.find(siblings, s => {
            return s.id !== node.data.id &&
                s.name === node.data.name;
        });
    }

    //check for large-form-container class
    containsLargeForm(node: any): boolean {
        return this.currentNodeData === node.data && this.isCreateContentMode;
    }
}
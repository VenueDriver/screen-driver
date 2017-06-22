import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
    providers: [VenuesTreeViewService, VenuesService]
})
export class VenuesTreeViewComponent implements OnInit {

    @Input() venues;

    @ViewChild(TreeComponent)
    private tree: TreeComponent;

    options;
    actionMapping;
    currentNode;

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
        event.stopPropagation();
        if (!node.data.children) {
            node.data.children = [];
        }
        node.data.children.push(this.createNode());
        this.tree.treeModel.update();
        node.expand();
    }

    createNode(): any {
        this.currentNode = {
            id: 'some-id',
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
        return node.level < 3 && !this.isCurrentNode(node);
    }

    performCancel(node: any) {
        let parentNodeData = node.parent.data;
        _.pull(parentNodeData.children, this.currentNode);
        this.tree.treeModel.update();
        this.clearCurrentNode();
    }

    validateForm() {

    }

}

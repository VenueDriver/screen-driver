import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import {VenuesTreeViewService} from "./venues-tree-view.service";
import {ITreeOptions} from "angular-tree-component/dist/defs/api";
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component/dist/models/tree-options.model";
import {VenuesService} from "../venues.service";
import {TreeComponent} from "angular-tree-component/dist/angular-tree-component";

import * as _ from 'lodash';
import {Content} from "../../content/content";

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

    @Input() venues;
    @Output() update = new EventEmitter();

    @ViewChild(TreeComponent)
    private tree: TreeComponent;

    contentUrlPlaceholder = 'Specify content URL';
    content: Content[];
    options;
    actionMapping;
    currentNode;
    isFormValid = false;

    constructor(
        private venuesTreeViewService: VenuesTreeViewService,
        private venuesService: VenuesService
    ) { }

    ngOnInit() {
        this.loadContent();
        this.actionMapping = this.getActionMapping();
        this.options = this.getTreeViewOptions();
    }

    loadContent() {
        this.venuesTreeViewService.loadContent()
            .subscribe(content => this.content = content);
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
        return node.level < 3 && _.isEmpty(this.currentNode);
    }

    performCancel(node: any) {
        let parentNodeData = node.parent.data;
        _.pull(parentNodeData.children, this.currentNode);
        this.tree.treeModel.update();
        this.clearCurrentNode();
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
        if (node.level == 2) {
            return parentNode.data.id;
        }
        return parentNode.parent.data.id;
    }

    getItemsForDropdown() {
        return _.map(this.content, c => {
            c.name = c.short_name;
            return c;
        });
    }

    setNodeContent(content) {
        this.currentNode.content = content;
        this.currentNode.content_id = content.id;
    }

}

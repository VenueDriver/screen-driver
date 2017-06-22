import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {VenuesTreeViewService} from "./venues-tree-view.service";
import {ITreeOptions} from "angular-tree-component/dist/defs/api";
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component/dist/models/tree-options.model";
import {VenuesService} from "../venues.service";
import {TreeComponent} from "angular-tree-component/dist/angular-tree-component";

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
    private actionMapping;

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
        node.data.children.push({name: 'name'});
        this.tree.treeModel.update();
    }
}

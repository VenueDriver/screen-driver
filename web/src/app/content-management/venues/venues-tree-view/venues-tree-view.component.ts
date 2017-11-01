import {Component, OnInit, Input, Output, ViewChild, EventEmitter, TemplateRef} from '@angular/core';
import {ITreeOptions} from "angular-tree-component/dist/defs/api";
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component/dist/models/tree-options.model";
import {KEYS} from "angular-tree-component/dist/constants/keys";
import {TreeComponent} from "angular-tree-component/dist/angular-tree-component";

import * as _ from 'lodash';

@Component({
    selector: 'venues-tree-view',
    templateUrl: 'venues-tree-view.component.html',
    styleUrls: ['./venues-tree-view.component.sass']
})
export class VenuesTreeViewComponent implements OnInit {

    @Input() venues: Array<any>;
    @Input() hasSelectedNode: boolean = false;
    @Input() template: TemplateRef<any>;

    @ViewChild(TreeComponent)
    private tree: TreeComponent;

    options: any;
    actionMapping: any;

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
            mouse: {click: this.getMouseClickAction()},
            keys: this.createDefaultActionConfigForKeys()
        }
    }

    getMouseClickAction() {
        return _.isEmpty(this.hasSelectedNode) ? TREE_ACTIONS.TOGGLE_EXPANDED : TREE_ACTIONS.DESELECT;
    }

    createDefaultActionConfigForKeys() {
        let keyConfig = {};
        _.forEach(KEYS, key => keyConfig[key] = () => {});
        return keyConfig;
    }
}
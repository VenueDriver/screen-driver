import { Component, OnInit } from '@angular/core';
import {VenuesTreeViewService} from "./venues-tree-view.service";
import {ITreeOptions} from "angular-tree-component/dist/defs/api";
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component/dist/models/tree-options.model";
import {VenuesService} from "../venues.service";

@Component({
    selector: 'venues-tree-view',
    templateUrl: 'venues-tree-view.component.html',
    styleUrls: ['./venues-tree-view.component.sass'],
    providers: [VenuesTreeViewService, VenuesService]
})
export class VenuesTreeViewComponent implements OnInit {

    private venues;
    private options;
    private actionMapping;

    constructor(
        private venuesTreeViewService: VenuesTreeViewService,
        private venuesService: VenuesService
    ) { }

    ngOnInit() {
        this.venuesService.loadVenues().subscribe(response => {
            this.venues = this.venuesService.getVenuesForTree(response.json());
            console.log(this.venues);
        });
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
}

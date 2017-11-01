import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {VenuesService} from "../../content-management/venues/venues.service";

import * as _ from 'lodash';
import {ScreensMessagingService} from "../../messaging/screens-messaging.service";
import {NotificationService} from "../../shared/notifications/notification.service";
import {VenuesTreeViewService} from "../../content-management/venues/venues-tree-view/venues-tree-view.service";
import {VenuesTreeViewComponent} from "../../content-management/venues/venues-tree-view/venues-tree-view.component";
import {Venue} from "../../core/entities/venue";
import {KioskVersionDetails} from "../entities/kiosk-version-details";

const MAX_DISPLAYING_URL_LENGTH = window.innerWidth > 768 ? 60 : 23;

@Component({
    selector: 'maintenance-venues-tree-view',
    templateUrl: 'maintenance-venues-tree-view.component.html',
    styleUrls: ['./maintenance-venues-tree-view.component.sass']
})
export class MaintenanceVenuesTreeViewComponent implements OnInit, OnDestroy {

    @Input() venues: Array<Venue>;
    @Input() kioskVersions: any = {};

    @Output() updateApplications = new EventEmitter();
    @Output() autoUpdateScheduleChange = new EventEmitter();

    @ViewChild(VenuesTreeViewComponent)
    private venuesTree: VenuesTreeViewComponent;

    options: any;
    currentNodeData: any;

    constructor(
        private venuesService: VenuesService,
        private treeViewService: VenuesTreeViewService,
        private notificationService: NotificationService,
        private screensService: ScreensMessagingService
    ) { }

    ngOnInit() {
        this.venuesService.getVenueUpdateSubscription().subscribe(() => this.onVenueUpdate());
    }

    ngOnDestroy() {
        this.treeViewService.removeEditableNode();
    }

    updateTreeViewOptions() {
        this.venuesTree.updateTreeViewOptions();
    }

    //+
    hasSelectedNode(): boolean {
        return !!this.currentNodeData;
    }

    isVenueNode(node: any): boolean {
        return this.checkNodeLevel(node, 1);
    }

    isScreenGroupNode(node: any): boolean {
        return this.checkNodeLevel(node, 2);
    }

    isScreenNode(node: any): boolean {
        return this.checkNodeLevel(node, 3);
    }

    private checkNodeLevel(node: any, level: number): boolean {
        return node && node.level == level;
    }

    //+
    isCurrentNode(node: any) {
        return _.isEqual(this.currentNodeData, node.data);
    }

    isAllowToAddChild(node: any) {
        return node.level < 3 && this.isAllowToEditNode();
    }

    //+
    isAllowToUpdateClientApp(node: any) {
        return node.level <= 3 && this.isAllowToEditNode();
    }

    //+
    isAllowToRefreshScreenContent(node: any) {
        return node.level == 3 && _.isEmpty(this.currentNodeData);
    }

    //+
    isAllowToEditNode() {
        return _.isEmpty(this.currentNodeData);
    }

    onVenueUpdate() {
        this.updateTreeViewOptions();
    }

    //+
    updateClientApps(event: any, node: any) {
        this.stopClickPropagation(event);

        let screens = this.getScreensFrom(node);
        this.updateTreeViewOptions();

        this.updateApplications.emit(screens);
    }

    //+
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

    //+
    hasChildren(node: any): boolean {
        return node.level < 3 && node.children && node.children.length > 0;
    }

    //+
    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

    //+
    refreshContent(id: string) {
        this.screensService.refreshScreen(id).subscribe(
            response => this.notificationService.showSuccessNotificationBar('Reload screen request was sent'),
            error => this.notificationService.showErrorNotificationBar('Unable to send reload screen request')
        );
    }

    getAddButtonTitle(node: any): string {
        let title = 'Add new screen';
        return node.level > 1 ? title : `${title} group`;
    }

    //+
    getUpdateClientButtonTitle(node: any): string {
        let nodeLevelName = this.treeViewService.getNodeLevelName(node.level);

        let appAmountMessage = this.hasChildren(node) ? "applications in" : "application for" ;

        return `Update client ${appAmountMessage} the ${nodeLevelName.toLowerCase()}`;
    }

    //+
    getRefreshButtonTitle(node: any): string {
        let nodeLevelName = this.treeViewService.getNodeLevelName(node.level);
        return `Refresh ${nodeLevelName.toLowerCase()} content`;
    }

    //+
    getNodeLevelName(node: any): string {
        return this.treeViewService.getNodeLevelName(node.level);
    }

    //++
    getPlaceholderForDefaultUrl(node: any): string {
        return this.treeViewService.getPlaceholderForDefaultUrl(node.level);
    }

    //++
    hasCurrentNode(): boolean {
        return !!this.currentNodeData;
    }

    getVersionDetailsForScreen(node: any): KioskVersionDetails {
        let screenId = node.data.id;
        return this.kioskVersions[screenId];
    }
}

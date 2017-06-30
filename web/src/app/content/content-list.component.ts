import {Component, OnInit} from '@angular/core';
import {Content} from "./content";
import {ContentService} from "./content.service";
import {NotificationService} from "../notifications/notification.service";

import * as _ from 'lodash';

@Component({
    selector: 'content-list',
    templateUrl: 'content-list.component.html',
    styleUrls: ['./content-list.component.sass']
})
export class ContentListComponent implements OnInit {
    content: Array<Content> = [];
    isAddModeEnabled: boolean = false;

    constructor(
        private contentService: ContentService,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.contentService
            .getContent()
            .subscribe(content => {
                content.forEach(item => this.content.push(new Content(item)));
                this.sortContent();
            });
    }

    showAddContentPanel() {
        this.isAddModeEnabled = true;
    }

    closeAddContentPanel() {
        this.isAddModeEnabled = false;
    }

    createContent(content) {
        this.contentService
            .createContent(content)
            .subscribe(
                newContent => {
                    this.content.push(new Content(newContent));
                    this.sortContent();
                },
                error => this.notificationService
                    .showErrorNotificationBar('Cannot create content. Message: ' + error.message));
    }

    sortContent() {
        this.content = _.sortBy(this.content, "short_name");
    }
}

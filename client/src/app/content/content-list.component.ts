import { Component, OnInit } from '@angular/core';
import {Content} from "./content";
import {ContentService} from "./content.service";

@Component({
    selector: 'content-list',
    templateUrl: 'content-list.component.html',
    styleUrls: ['./content-list.component.sass']
})
export class ContentListComponent implements OnInit {
    content: Array<Content> = [];
    isAddModeEnabled: boolean = false;

    constructor(private contentService: ContentService) {}

    ngOnInit() {
        this.contentService
            .getContent()
            .subscribe(content => {
                content.forEach(item => this.content.push(new Content(item)));
            });
    }

    showAddContentPanel() {
        this.isAddModeEnabled = true;
    }

    closeAddContentPanel() {
        this.isAddModeEnabled = false;
    }

}

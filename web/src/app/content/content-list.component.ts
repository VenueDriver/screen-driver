import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {Content} from "./content";
import {ContentService} from "./content.service";

@Component({
    selector: 'content-list',
    templateUrl: 'content-list.component.html',
})
export class ContentListComponent implements OnInit {

    content: Array<Content> = [];

    constructor(private contentService: ContentService) {
    }

    ngOnInit() {
        this.contentService.getContent()
            .subscribe(content => {
                _.each(content, item => this.content.push(new Content(item)));
                this.sortContent();
            });
    }

    sortContent() {
        this.content = _.sortBy(this.content, 'short_name');
    }
}

import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Content} from "../../content";
import {DeviceSizeChecker} from "../../../shared/utils/device-size-checker";

const MAX_DISPLAYING_URL_LENGTH = DeviceSizeChecker.isTablet() ? 70 : 150;

@Component({
    selector: 'content-info',
    templateUrl: './content-info.component.html',
    styleUrls: ['./content-info.component.sass']
})
export class ContentInfoComponent implements OnInit {

    @Input() content: Content;

    constructor() {
    }

    ngOnInit() {
    }

    getContentUrl(): string {
        return Content.getShortUrl(this.content, MAX_DISPLAYING_URL_LENGTH);
    }
}

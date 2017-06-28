import {Component, OnInit, Input} from '@angular/core';
import {Content} from "../content";
import {ContentService} from "../content.service";

@Component({
    selector: 'content-row',
    templateUrl: './content-row.component.html',
    styleUrls: ['./content-row.component.sass']
})
export class ContentRowComponent implements OnInit {
    @Input() content: Content;
    editMode: boolean = false;

    constructor(private contentService: ContentService) {
    }

    ngOnInit() {

    }

    setEditModeState(state: boolean) {
        this.editMode = state;
    }

    updateContent(content: Content) {
        this.setEditModeState(false);
        this.contentService
            .updateContent(content)
            .subscribe(
                updatedContent => this.content = updatedContent,
                error => alert('Cannot update content. Message:' + JSON.parse(error._body).message));
    }

}

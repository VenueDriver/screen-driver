import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ContentService} from "../../content/content.service";
import {Content} from "../../content/content";

@Injectable()
export class VenuesTreeViewService {

    constructor(private contentService: ContentService) { }

    loadContent(): Observable<Content[]> {
        return this.contentService.getContent();
    }
}

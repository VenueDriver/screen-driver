import { Injectable } from '@angular/core';
import {ContentService} from "../../content/content.service";
import {Content} from "../../content/content";
import {Observable} from "rxjs";

@Injectable()
export class VenuesTreeViewService {

    constructor(private contentService: ContentService) { }

    getNodeLevelName(level: number): string {
        switch (level) {
            case 3: return 'Screen';
            case 2: return 'Screen group';
            default: return 'Venue';
        }
    }

    getPlaceholderForDefaultUrl(level: number): string {
        if (level == 1) {
            return 'Content URL is not specified';
        }
        let parentNodeLevelName = this.getParentNodeLevelName(level);
        return `Content URL inherited from ${parentNodeLevelName}`;
    }

    private getParentNodeLevelName(level: number): string {
        let parentNodeLevelName = this.getNodeLevelName(level - 1);
        return parentNodeLevelName.toLowerCase();
    }

    saveNewContent(content: Content): Observable<Content> {
        return this.contentService.createContent(content);
    }
}
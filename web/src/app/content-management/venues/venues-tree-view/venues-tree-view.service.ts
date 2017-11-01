import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

import * as _ from 'lodash';

@Injectable()
export class VenuesTreeViewService {

    private editedNode: BehaviorSubject<any> = new BehaviorSubject<any>({});

    constructor() { }

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

    setEditableNode(node: any) {
        this.editedNode.next(node);
    }

    removeEditableNode() {
        this.editedNode.next({});
    }

    isTreeEdited(): boolean {
        let editedNode = this.editedNode.getValue();
        return !_.isEmpty(editedNode);
    }
}
import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class VenuesTreeViewService {
    private editedNodes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

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

    addEditableNode(node: any) {
        let nodes = this.editedNodes.getValue();
        nodes.push(node);
        this.editedNodes.next(nodes);
    }

    removeEditableNode(node?: any) {
        if (!!node) {
            let nodes = this.editedNodes.getValue().filter(n => n.id !== node.id);
            this.editedNodes.next(nodes);
        } else {
            this.editedNodes.next([]);
        }
    }

    isTreeEdited(): boolean {
        return this.editedNodes.getValue().length > 0;
    }
}
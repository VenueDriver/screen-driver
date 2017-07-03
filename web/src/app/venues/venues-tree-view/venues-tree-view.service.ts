import { Injectable } from '@angular/core';

@Injectable()
export class VenuesTreeViewService {

    constructor() { }

    getNodeLevelName(level: number): string {
        switch (level) {
            case 3: return 'Screen';
            case 2: return 'Screen group';
            default: return 'Venue';
        }
    }

    createDefaultValue(node: any): any {
        let defaultName = this.getDefaultValueForContentDropdown(node);
        return this.generateDefaultValueForDropdown(defaultName);
    }

    generateDefaultValueForDropdown(valueForName: string): any {
        return {
            id: '',
            name: valueForName
        }
    }

    private getDefaultValueForContentDropdown(level: number): string {
        if (level == 1) {
            return 'Is not specified';
        }
        let parentNodeLevelName = this.getParentNodeLevelName(level);
        return `Inherit from ${parentNodeLevelName}`;
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
}
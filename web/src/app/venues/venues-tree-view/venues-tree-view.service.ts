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
}
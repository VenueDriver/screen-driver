import {Component} from '@angular/core';

import * as _ from 'lodash';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent {

    title = 'app';

    constructor() {
    }

    isSidebarDisplayed(): boolean {
        let path = this.getCurrentPageUri();
        return _.isEqual(path, '/content');
    }

    private getCurrentPageUri() {
        return document.location.hash.replace('#', '');
    }
}

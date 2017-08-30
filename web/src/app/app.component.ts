import {Component, OnInit} from '@angular/core';
import {Router, RoutesRecognized} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

    title = 'app';
    isSidebarHidden: boolean;

    constructor(private route: Router) {
    }

    ngOnInit() {
        this.route.events.subscribe((data) => {
            if (data instanceof RoutesRecognized) {
                this.isSidebarHidden = data.state.root.firstChild.data['isSidebarHidden'];
            }
        });
    }
}

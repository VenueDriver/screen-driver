import {Component, OnInit} from '@angular/core';
import {HeaderService} from "./header.service";
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'screen-driver-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {

    constructor(private headerService: HeaderService,
                private authService: AuthService) {
    }

    ngOnInit() {
    }

    toggleSideBar() {
        this.headerService.pushSidebarToggleEvent();
    }

    isAuthenticated(): boolean {
        return this.authService.authenticated();
    }

}

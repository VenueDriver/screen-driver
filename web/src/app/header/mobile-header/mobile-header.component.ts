import { Component } from '@angular/core';
import {HeaderService} from "../header.service";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: 'screen-driver-mobile-header',
    templateUrl: 'mobile-header.component.html',
    styleUrls: [
        '../header.component.sass',
        'mobile-header.component.sass'
    ]
})
export class MobileHeaderComponent {

    constructor(
        private headerService: HeaderService,
        private authService: AuthService
    ) { }

    toggleSideBar() {
        this.headerService.pushSidebarToggleEvent();
    }

    isUserAdmin(): boolean {
        return this.authService.isAdmin();
    }

    isAuthPage(): boolean {
        return !!this.authService.isAuthPage();
    }

    isSidebarDisplayed() {
        return this.authService.isCurrentPath('/content');
    }

    getUserLogin() {
        return this.authService.getCurrentUserLogin();
    }

    signOut() {
        this.authService.signOut();
    }
}

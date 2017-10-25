import { Component } from '@angular/core';
import {HeaderService} from "./header.service";
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'screen-driver-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.sass']
})
export class HeaderComponent {

    public routerLinks: [{ title: string, routerLink: string }] = [
        {title: 'Content', routerLink: '/content'},
        {title: 'Maintenance', routerLink: '/maintenance'},
        {title: 'Users', routerLink: '/users'}
    ];

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

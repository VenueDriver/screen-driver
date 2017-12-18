import {Component} from '@angular/core';
import {HeaderService} from "./header.service";
import {AuthService} from "../auth/auth.service";
import {NavBarLink} from "./nav-bar-link.interface";
import {UserRole} from "../auth/user-roles";

@Component({
    selector: 'screen-driver-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.sass']
})
export class HeaderComponent {

    public routerLinks: Array<NavBarLink> = [
        {title: 'Settings', routerLink: '/settings', permittedFor: UserRole.ALL},
        {title: 'Content', routerLink: '/content-list', permittedFor: UserRole.ALL},
        {title: 'Maintenance', routerLink: '/maintenance', permittedFor: UserRole.ALL},
        {title: 'Users', routerLink: '/users', permittedFor: UserRole.ADMIN}
    ];

    constructor(
        private headerService: HeaderService,
        private authService: AuthService
    ) { }

    toggleSideBar() {
        this.headerService.pushSidebarToggleEvent();
    }

    isNotAuthPage(): boolean {
        return !this.authService.isAuthPage();
    }

    isSidebarDisplayed() {
        return this.authService.isCurrentPathEqualTo('/settings');
    }

    getUserLogin() {
        return this.authService.getCurrentUserLogin();
    }

    signOut() {
        this.authService.signOut();
    }

}

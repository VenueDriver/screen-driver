import {Component, OnInit, HostListener} from '@angular/core';
import {HeaderService} from "./header.service";
import {AuthService} from "../auth/auth.service";
import {NavBarLink} from "./nav-bar-link.interface";
import {UserRole} from "../auth/user-roles";

@Component({
    selector: 'screen-driver-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.sass']
})
export class HeaderComponent implements OnInit {

    public routerLinks: Array<NavBarLink> = [
        {title: 'Content', routerLink: '/content', permittedFor: UserRole.ALL},
        {title: 'Maintenance', routerLink: '/maintenance', permittedFor: UserRole.ALL},
        {title: 'Users', routerLink: '/users', permittedFor: UserRole.ADMIN}
    ];

    private topHeader;

    constructor(
        private headerService: HeaderService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.topHeader = document.getElementById('pull-top');
    }

    @HostListener('window:scroll')
    onScroll() {
        this.topHeader.style.display = window.pageYOffset > 30 ? 'none' : 'block';
    }

    toggleSideBar() {
        this.headerService.pushSidebarToggleEvent();
    }

    isNotAuthPage(): boolean {
        return !this.authService.isAuthPage();
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

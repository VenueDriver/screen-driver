import { Component, OnInit } from '@angular/core';
import {HeaderService} from "./header.service";
import {AuthService} from "../auth/auth.service";
import {User} from "../auth/user";

import * as _ from 'lodash';

@Component({
    selector: 'screen-driver-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.sass']
})
export class HeaderComponent implements OnInit {
    currentUser: User;

    constructor(
        private headerService: HeaderService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.currentUser = this.authService.currentUser.getValue();
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
        })
    }

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

    getUserEmail() {
        return _.isEmpty(this.currentUser) ? '' : this.currentUser.email;
    }

    signOut() {
        this.authService.signOut();
    }
}

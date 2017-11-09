import {Component, OnInit, OnDestroy} from '@angular/core';
import {UsersService} from "../users.service";
import {User} from "../../core/entities/user";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

import * as _ from 'lodash';
import {SpinnerService} from "../../shared/spinner/spinner.service";

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    private currentUser: User;
    users: User[] = [];

    constructor(private usersService: UsersService,
                private authService: AuthService,
                private spinnerService: SpinnerService) {
    }

    ngOnInit() {
        let loadUserSubscription = this.usersService.getUsers().subscribe(users => this.users = users);
        let createUserSubscription = this.usersService.createUserEvent.subscribe(user => this.users.push(user));
        this.subscriptions.push(loadUserSubscription, createUserSubscription);
        this.currentUser = this.authService.currentUser.getValue();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    changeUserRole(user: User) {
        user.isAdmin = !user.isAdmin;
        this.usersService.update(user);
    }

    isCurrentUser(user: User): boolean {
        return _.isEqual(user.id, this.currentUser.id);
    }

    getToggleHint(user: User): string {
        return this.isCurrentUser(user) ? 'You can\'t change the role of yourself' : '';
    }

    changeUserStatus(user: User) {
        this.usersService.changeUserStatus(user)
            .subscribe(response => {
                user.enabled = !user.enabled;
            })
    }

    getChangeUserStatusHint(user) {
        return `${user.enabled ? 'Lock' : 'Unlock'} user account`;
    }
}

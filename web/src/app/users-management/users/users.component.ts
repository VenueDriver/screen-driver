import {Component, OnInit, OnDestroy} from '@angular/core';
import {UsersService} from "../users.service";
import {User} from "../../common/entities/user";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

import * as _ from 'lodash';

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
                private authService: AuthService) {
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
        return _.isEqual(user.email, this.currentUser.email);
    }

    getToggleHint(user: User): string {
        return this.isCurrentUser(user) ? 'You can\'t change the role of yourself' : '';
    }
}

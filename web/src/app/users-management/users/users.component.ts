import {Component, OnInit, OnDestroy} from '@angular/core';
import {UsersService} from "../users.service";
import {User} from "../../auth/user";
import {Subscription} from "rxjs";

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    users: User[] = [];

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
        let loadUserSubscription = this.usersService.loadUsers().subscribe(users => this.users = users.json());
        let createUserSubscription = this.usersService.createUserEvent.subscribe(user => this.users.push(user));
        this.subscriptions.push(loadUserSubscription, createUserSubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    changeUserRole(user: User) {
        this.usersService.update(user);
    }
}

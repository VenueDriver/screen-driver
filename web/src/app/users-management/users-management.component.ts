import {Component, OnInit} from '@angular/core';
import {UsersService} from "./users.service";

@Component({
    selector: 'users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.sass']
})
export class UsersManagementComponent implements OnInit {
    isShowCreateUserForm: boolean = false;

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
    }

    showCreateUserForm(flag: boolean) {
        this.isShowCreateUserForm = flag;
    }

    createUser(event: any) {
        this.showCreateUserForm(false);
        this.usersService.create(event);
    }
}

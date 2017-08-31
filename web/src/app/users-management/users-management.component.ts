import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.sass']
})
export class UsersManagementComponent implements OnInit {
    isShowCreateUserForm: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    showCreateUserForm(flag: boolean) {
        this.isShowCreateUserForm = flag;
    }

    createUser(event: any) {
        this.showCreateUserForm(false);
    }
}

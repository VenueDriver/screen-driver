import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {UsersService} from "../../users-management/users.service";
import {User} from "../../user/user";

import * as _ from 'lodash';

@Component({
    selector: 'change-email',
    templateUrl: './change-email.component.html',
    styleUrls: ['./change-email.component.sass']
})
export class ChangeEmailComponent implements OnInit {
    @Input() user: User;
    @Output() submit = new EventEmitter();
    @Output() cancel = new EventEmitter();
    editedUser: User;
    errorMessage: string;

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
        this.editedUser = _.clone(this.user);
    }

    performCancel() {
        this.cancel.emit();
    }

    performSubmit() {
        if (this.user.email === this.editedUser.email) {
            this.errorMessage = "You already have this email";
            return;
        }

        if (!User.isEmailValid(this.editedUser.email)) {
            this.errorMessage = 'Invalid Email';
            return;
        }

        this.updateUser();
    }

    private updateUser() {
        this.usersService.update(this.editedUser).subscribe(
            user => {
                this.submit.emit(user);
            },
            error => {
                this.errorMessage = 'Couldn\'t change the email';
            });
    }
}
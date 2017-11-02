import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ProfileManagementService} from "../profile-management.service";
import {User} from "../../core/entities/user";

import * as _ from 'lodash';
import {AuthService} from "../../auth/auth.service";

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

    constructor(private profileManagementService: ProfileManagementService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.editedUser = _.clone(this.user);
    }

    performCancel() {
        this.cancel.emit();
    }

    performSubmit() {
        if (this.user.email === this.editedUser.email) {
            this.performCancel();
            return;
        }

        if (!User.isEmailValid(this.editedUser.email)) {
            this.errorMessage = 'Invalid Email';
            return;
        }

        this.changeEmail();
    }

    private changeEmail() {
        this.profileManagementService.editProfile(this.editedUser).subscribe(
            response => {
                this.handleEditProfileResponse(response);
            },
            error => {
                this.errorMessage = 'Couldn\'t change the email';
            });
    }

    private handleEditProfileResponse(response) {
        this.authService.refreshToken().subscribe(
            () => {
                this.submit.emit(response);
            },
            () => {
                this.authService.signOut();
            }
        );
    }
}

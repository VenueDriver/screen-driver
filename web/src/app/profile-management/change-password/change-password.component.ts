import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {User} from "../../user/user";
import {NgModel} from "@angular/forms";

import * as _ from 'lodash';
import {UsersService} from "../../users-management/users.service";

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit {
    @Input() user: User = new User();
    @Output() cancel = new EventEmitter();
    @Output() changed = new EventEmitter();
    isRequestPerforming: boolean = false;
    confirmedPassword: string = '';
    failMessage: string;

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
    }

    validatePassword(passwordModel: NgModel) {
        switch (passwordModel.name) {
            case 'new-password':
                this.validateNewPassword(passwordModel);
                break;
            case 'confirm-new-password':
                this.validateConfirmedPassword(passwordModel);
        }
    }

    private validateNewPassword(passwordModel: NgModel) {
        let passwordRegexp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        let errors = {};

        if (this.user.newPassword.length < 8) errors['smallLength'] = true;
        if (!passwordRegexp.test(this.user.newPassword)) errors['failRegExp'] = true;
        passwordModel.control.setErrors(errors);
    }

    private validateConfirmedPassword(passwordModel: NgModel) {
        let errors = {};
        if (!_.isEqual(this.user.newPassword, this.confirmedPassword)) errors['confirmationFailed'] = true;
        passwordModel.control.setErrors(errors);
    }

    getValidationMessage(passwordModel: NgModel): string {
        if (passwordModel.control.hasError('required')) return 'Please fill out this field';
        if (passwordModel.control.hasError('smallLength')) return 'Password is too short (minimum is 8 characters)';
        if (passwordModel.control.hasError('failRegExp')) return 'Password needs at least one number and one letter';
        if (passwordModel.control.hasError('confirmationFailed')) return 'Password doesn\'t match the confirmation';
        if (passwordModel.control.hasError('notValid')) return 'Invalid password';
    }

    shouldDisplaySubmitButton(models: NgModel[]): boolean {
        return this.isModelsValid(models) && !this.isRequestPerforming;
    }

    isModelsValid(models: NgModel[]): boolean {
        return !_.find(models, model => this.getValidationMessage(model));
    }

    changePassword() {
        this.setRequestPerforming(true);
        this.usersService.changePassword(this.user).subscribe(
            () => {
                this.setRequestPerforming(false);
                this.changed.emit();
            },
            () => this.setRequestPerforming(false)
        )
    }

    setRequestPerforming(flag: boolean) {
        this.isRequestPerforming = flag;
    }

    performCancel() {
        this.cancel.emit();
    }

}

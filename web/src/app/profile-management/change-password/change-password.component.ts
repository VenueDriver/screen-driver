import {Component, OnInit} from '@angular/core';
import {User} from "../../user/user";
import {NgModel} from "@angular/forms";

import * as _ from 'lodash';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit {
    user: User = new User();
    confirmedPassword: string = '';

    constructor() {
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
        if (passwordRegexp.test(this.user.newPassword)) errors['failRegExp'] = true;
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

    isModelsValid(...models: NgModel[]): boolean {
        return !!_.find(models, model => model.invalid)
    }

}

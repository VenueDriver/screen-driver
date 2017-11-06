import {Component, Output, EventEmitter} from '@angular/core';

import {ProfileManagementService} from "../profile-management.service";
import {ResetPassword} from "../../shared/reset-password-form/reset-password";

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent {
    @Output() cancel = new EventEmitter();
    @Output() success = new EventEmitter();

    isRequestPerforming: boolean = false;

    constructor(private profileManagementService: ProfileManagementService) {
    }


    changePassword(formData: ResetPassword) {
        this.setRequestPerforming(true);
        this.profileManagementService.changePassword(this.extractDataFromForm(formData)).subscribe(
            () => {
                this.setRequestPerforming(false);
                this.success.emit();
            },
            () => this.setRequestPerforming(false)
        )
    }

    extractDataFromForm(formData: ResetPassword) {
        return {
            currentPassword: formData.identityVerificationCode,
            newPassword: formData.password
        };
    }

    setRequestPerforming(flag: boolean) {
        this.isRequestPerforming = flag;
    }

    performCancel() {
        this.cancel.emit();
    }

}

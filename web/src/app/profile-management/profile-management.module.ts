import {NgModule} from '@angular/core';
import {ProfileManagementComponent} from './profile-management.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";
import { ChangeEmailComponent } from './change-email/change-email.component';

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        AutofocusModule
    ],
    declarations: [
        ProfileManagementComponent,
        UserProfileComponent,
        ChangePasswordComponent,
        ChangeEmailComponent
    ]
})
export class ProfileManagementModule {
}

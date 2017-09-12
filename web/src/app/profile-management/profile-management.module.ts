import {NgModule} from '@angular/core';
import {ProfileManagementComponent} from './profile-management.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        AutofocusModule
    ],
    declarations: [
        ProfileManagementComponent,
        UserProfileComponent,
        ChangePasswordComponent
    ]
})
export class ProfileManagementModule {
}

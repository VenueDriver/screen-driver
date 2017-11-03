import {NgModule} from '@angular/core';
import {ProfileManagementComponent} from './profile-management.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AutofocusModule} from "../shared/directives/autofocus/autofocus.module";
import { ChangeEmailComponent } from './change-email/change-email.component';
import {ProfileManagementService} from "./profile-management.service";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AutofocusModule
    ],
    declarations: [
        ProfileManagementComponent,
        UserProfileComponent,
        ChangePasswordComponent,
        ChangeEmailComponent
    ],
    providers: [
        ProfileManagementService
    ]
})
export class ProfileManagementModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileManagementComponent} from './profile-management.component';
import {UserProfileComponent} from './user-profile/user-profile.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ProfileManagementComponent,
        UserProfileComponent
    ]
})
export class ProfileManagementModule {
}

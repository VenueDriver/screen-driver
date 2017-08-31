import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersManagementComponent} from "./users-management.component";
import { CreateUserComponent } from './create-user/create-user.component';
import { UsersComponent } from './users/users.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        UsersManagementComponent,
        CreateUserComponent,
        UsersComponent
    ]
})
export class UsersManagementModule {
}

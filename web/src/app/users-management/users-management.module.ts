import {NgModule} from "@angular/core";
import {UsersManagementComponent} from "./users-management.component";
import {CreateUserComponent} from "./create-user/create-user.component";
import {UsersComponent} from "./users/users.component";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        UsersManagementComponent,
        CreateUserComponent,
        UsersComponent
    ]
})
export class UsersManagementModule {
}

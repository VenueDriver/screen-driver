import {NgModule} from "@angular/core";
import {UsersManagementComponent} from "./users-management.component";
import {CreateUserComponent} from "./create-user/create-user.component";
import {UsersComponent} from "./users/users.component";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {UsersService} from "./users.service";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";
import {SharedModule} from "../shared/shared.module";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        SharedModule,
        AutofocusModule
    ],
    declarations: [
        UsersManagementComponent,
        CreateUserComponent,
        UsersComponent
    ],
    providers: [
        UsersService
    ]
})
export class UsersManagementModule {
}

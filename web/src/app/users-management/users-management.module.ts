import {NgModule} from "@angular/core";
import {UsersManagementComponent} from "./users-management.component";
import {CreateUserComponent} from "./create-user/create-user.component";
import {UsersComponent} from "./users/users.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {UsersService} from "./users.service";
import {AutofocusModule} from "../shared/directives/autofocus/autofocus.module";
import {ToggleButtonModule} from "../shared/toggle-button/toggle-button.module";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ToggleButtonModule,
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

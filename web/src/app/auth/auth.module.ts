import {NgModule} from '@angular/core';
import {AuthComponent} from './auth-page/auth.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {AuthTokenService} from "./auth-token.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [AuthComponent],
    providers: [
        AuthService,
        AuthTokenService
    ]
})
export class AuthModule {
}

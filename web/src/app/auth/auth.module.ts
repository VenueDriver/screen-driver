import {NgModule} from '@angular/core';
import {AuthComponent} from './auth-page/auth.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {AuthTokenService} from "./auth-token.service";
import {SignInComponent} from './auth-page/sign-in/sign-in.component';
import {RouterModule} from "@angular/router";
import {ResetPasswordComponent} from './auth-page/reset-password/reset-password.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule
    ],
    declarations: [
        AuthComponent,
        SignInComponent,
        ResetPasswordComponent
    ],
    providers: [
        AuthService,
        AuthTokenService
    ]
})
export class AuthModule {
}

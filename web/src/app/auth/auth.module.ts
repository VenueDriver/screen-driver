import {NgModule} from '@angular/core';
import {AuthComponent} from './auth-page/auth.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {AuthTokenService} from "./auth-token.service";
import {SignInComponent} from './auth-page/sign-in/sign-in.component';
import {RouterModule} from "@angular/router";
import {ResetPasswordComponent} from './auth-page/reset-password/reset-password.component';
import { ResetPasswordRequestComponent } from './auth-page/reset-password/reset-password-request/reset-password-request.component';
import { ResetPasswordConfirmComponent } from './auth-page/reset-password/reset-password-confirm/reset-password-confirm.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        AuthComponent,
        SignInComponent,
        ResetPasswordComponent,
        ResetPasswordRequestComponent,
        ResetPasswordConfirmComponent
    ],
    providers: [
        AuthService,
        AuthTokenService
    ]
})
export class AuthModule {
}

import {NgModule} from '@angular/core';
import {AuthComponent} from './auth-page/auth.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {AuthTokenService} from "./auth-token.service";
import {SignInComponent} from './auth-page/sign-in/sign-in.component';
import {RouterModule} from "@angular/router";
import {ResetPasswordComponent} from './auth-page/reset-password/reset-password.component';
import { RequestResetPasswordFormComponent } from './auth-page/reset-password/request-reset-password-form/request-reset-password-form.component';
import { ConfirmResetPasswordFormComponent } from './auth-page/reset-password/confirm-reset-password-form/confirm-reset-password-form.component';
import {ResetPasswordService} from "./auth-page/reset-password/reset-password.service";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    declarations: [
        AuthComponent,
        SignInComponent,
        ResetPasswordComponent,
        RequestResetPasswordFormComponent,
        ConfirmResetPasswordFormComponent
    ],
    providers: [
        AuthService,
        AuthTokenService,
        ResetPasswordService
    ]
})
export class AuthModule {
}

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
import {ResetPasswordFormModule} from "../shared/reset-password-form/reset-password-form.module";
import {FirstSignInComponent} from "./auth-page/first-sign-in/first-sign-in.component";
import {ApiService} from "../shared/services/api.service";
import {ConfirmPasswordFieldsModule} from "../shared/confirm-password-fields/confirm-password-fields.module";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ResetPasswordFormModule,
        ConfirmPasswordFieldsModule
    ],
    declarations: [
        AuthComponent,
        SignInComponent,
        FirstSignInComponent,
        ResetPasswordComponent,
        RequestResetPasswordFormComponent,
        ConfirmResetPasswordFormComponent
    ],
    providers: [
        AuthService,
        AuthTokenService,
        ResetPasswordService,
        ApiService
    ]
})
export class AuthModule {
}

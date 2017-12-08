import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResetPasswordFormComponent} from "./reset-password-form.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";
import {ConfirmPasswordFieldsModule} from "../confirm-password-fields/confirm-password-fields.module";

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AutofocusModule,
        ConfirmPasswordFieldsModule
    ],
    declarations: [
        ResetPasswordFormComponent
    ],
    exports: [
        ResetPasswordFormComponent
    ]
})
export class ResetPasswordFormModule {
}

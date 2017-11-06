import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResetPasswordFormComponent} from "./reset-password-form.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AutofocusModule
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

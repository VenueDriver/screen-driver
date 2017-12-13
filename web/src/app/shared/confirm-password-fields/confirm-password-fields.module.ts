import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmPasswordFieldsComponent} from "./confirm-password-fields.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [ConfirmPasswordFieldsComponent],
    exports: [ConfirmPasswordFieldsComponent]
})
export class ConfirmPasswordFieldsModule {
}

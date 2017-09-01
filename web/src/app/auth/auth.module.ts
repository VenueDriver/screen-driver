import {NgModule} from '@angular/core';
import {AuthComponent} from './auth.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [AuthComponent]
})
export class AuthModule {
}

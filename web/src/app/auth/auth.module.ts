import {NgModule} from '@angular/core';
import {AuthComponent} from './auth.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [AuthComponent],
    providers: [AuthService]
})
export class AuthModule {
}

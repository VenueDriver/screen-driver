import { NgModule } from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {AutocompleteComponent} from "./autocomplete.component";
import {ClickOutsideModule} from "../../directives/click-outside/click-outside.module";

@NgModule({
    imports: [
        BrowserModule,
        ClickOutsideModule
    ],
    exports: [
        AutocompleteComponent
    ],
    declarations: [
        AutocompleteComponent
    ],
    providers: []
})
export class AutocompleteModule {

}
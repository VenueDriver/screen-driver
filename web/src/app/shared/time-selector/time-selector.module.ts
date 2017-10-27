import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimeSelectorComponent} from './time-selector.component';
import {BrowserModule} from "@angular/platform-browser";
import {AutocompleteModule} from "../autocomplete/autocomplete.module";

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        AutocompleteModule
    ],
    exports: [
        TimeSelectorComponent
    ],
    declarations: [TimeSelectorComponent]
})
export class TimeSelectorModule {
}

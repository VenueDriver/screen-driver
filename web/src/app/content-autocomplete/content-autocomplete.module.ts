import {NgModule} from "@angular/core";
import {ContentAutocompleteComponent} from "./content-autocomplete.component";
import {BrowserModule} from "@angular/platform-browser";
import {ClickOutsideModule} from "../directives/click-outside/click-outside.module";

@NgModule({
    imports: [
        BrowserModule,
        ClickOutsideModule
    ],
    exports: [
        ContentAutocompleteComponent
    ],
    declarations: [
        ContentAutocompleteComponent
    ],
    providers: []
})
export class ContentAutocompleteModule {

}
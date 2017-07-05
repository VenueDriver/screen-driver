import {NgModule} from "@angular/core";
import {AutoCompleteModule} from "@progress/kendo-angular-dropdowns";
import {ContentAutocompleteComponent} from "./content-autocomplete.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AutoCompleteModule
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
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {DropdownComponent} from "./dropdown.component";

@NgModule({
    imports: [
        BrowserModule
    ],
    exports: [
        DropdownComponent
    ],
    declarations: [
        DropdownComponent
    ]
})
export class DropdownModule {

}

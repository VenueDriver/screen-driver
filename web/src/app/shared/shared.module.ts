import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ToggleButtonModule} from "./toggle-button/toggle-button.module";
import {ToggleButtonComponent} from "./toggle-button/toggle-button.component";

@NgModule({
    imports: [
        BrowserModule,
        ToggleButtonModule
    ],
    exports: [ToggleButtonComponent],
    declarations: [],
    providers: []
})
export class SharedModule {

}

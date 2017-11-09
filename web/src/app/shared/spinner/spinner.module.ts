import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {SpinnerComponent} from "./spinner.component";
import {SpinnerService} from "./spinner.service";

@NgModule({
    imports: [
        BrowserModule
    ],
    exports: [
        SpinnerComponent
    ],
    declarations: [
        SpinnerComponent,
    ],
    providers: [ SpinnerService ]
})
export class SpinnerModule {

}
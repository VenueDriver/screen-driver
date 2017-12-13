import {NgModule} from "@angular/core";
import {HeaderComponent} from "./header.component";
import {HeaderService} from "./header.service";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {HideOnScrollModule} from "../shared/directives/hide-on-scroll/hide-on-scroll.module";

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
        HideOnScrollModule,
    ],
    declarations: [
        HeaderComponent,
    ],
    exports: [
        HeaderComponent,
    ],
    providers: [
        HeaderService
    ]
})
export class HeaderModule {

}

import {NgModule} from "@angular/core";
import {HeaderComponent} from "./header.component";
import {MobileHeaderComponent} from "./mobile-header/mobile-header.component";
import {HeaderService} from "./header.service";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
    ],
    declarations: [
        HeaderComponent,
        MobileHeaderComponent
    ],
    exports: [
        HeaderComponent,
        MobileHeaderComponent
    ],
    providers: [
        HeaderService
    ]
})
export class HeaderModule {

}
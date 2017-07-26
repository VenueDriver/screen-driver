import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {TabbedSwitcherComponent} from "./tabbed-switcher.component";
import {SingleTabComponent} from "./tab/single-tab.component";

@NgModule({
    imports: [
        BrowserModule
    ],
    exports: [
        TabbedSwitcherComponent,
        SingleTabComponent
    ],
    declarations: [
        TabbedSwitcherComponent,
        SingleTabComponent
    ],
    providers: []
})
export class TabbedSwitcherModule {

}
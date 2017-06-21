import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser';
import {VenuesComponent} from "./venues.component";
import {TreeModule} from "angular-tree-component/dist/angular-tree-component";
import {VenuesTreeViewComponent} from "./venues-tree-view/venues-tree-view.component";

@NgModule({
    imports: [
        BrowserModule,
        TreeModule
    ],
    exports: [
        VenuesComponent
    ],
    declarations: [
        VenuesComponent,
        VenuesTreeViewComponent
    ]
})
export class VenuesModule {

}

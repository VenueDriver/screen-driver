import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser';
import {VenuesComponent} from "./venues.component";
import {TreeModule} from "angular-tree-component/dist/angular-tree-component";
import {VenuesTreeViewComponent} from "./venues-tree-view/venues-tree-view.component";
import {AddVenueFormComponent} from "./add-venue-form/add-venue-form.component";

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
        VenuesTreeViewComponent,
        AddVenueFormComponent
    ]
})
export class VenuesModule {

}

import {NgModule} from "@angular/core";
import {VenuesComponent} from "./venues.component";
import {TreeModule} from "angular-tree-component/dist/angular-tree-component";
import {VenuesTreeViewComponent} from "./venues-tree-view/venues-tree-view.component";
import {AddVenueFormComponent} from "./add-venue-form/add-venue-form.component";

@NgModule({
    imports: [
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

import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {VenuesComponent} from "./venues.component";
import {TreeModule} from "angular-tree-component/dist/angular-tree-component";
import {VenuesTreeViewComponent} from "./venues-tree-view/venues-tree-view.component";
import {AddVenueFormComponent} from "./add-venue-form/add-venue-form.component";
import {DropdownModule} from "../dropdown/dropdown.module";
import {ContentService} from "../content/content.service";
import {EditVenueFormComponent} from "./edit-venue-form/edit-venue-form.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        DropdownModule,
        TreeModule
    ],
    exports: [
        VenuesComponent
    ],
    declarations: [
        VenuesComponent,
        VenuesTreeViewComponent,
        EditVenueFormComponent,
        AddVenueFormComponent,
    ],
    providers: [
        ContentService
    ]
})
export class VenuesModule {

}

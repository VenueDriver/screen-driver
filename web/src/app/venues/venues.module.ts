import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {VenuesComponent} from "./venues.component";
import {TreeModule} from "angular-tree-component/dist/angular-tree-component";
import {VenuesTreeViewComponent} from "./venues-tree-view/venues-tree-view.component";
import {DropdownModule} from "../dropdown/dropdown.module";
import {ContentService} from "../content/content.service";
import {EditTreeViewNodeFormComponent} from "./edit-tree-view-node-form/edit-tree-view-node-form.component";
import {VenuesTreeViewService} from "./venues-tree-view/venues-tree-view.service";

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
        EditTreeViewNodeFormComponent,
    ],
    providers: [
        ContentService,
        VenuesTreeViewService
    ]
})
export class VenuesModule {

}

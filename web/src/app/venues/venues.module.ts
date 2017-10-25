import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {VenuesComponent} from "./venues.component";
import {TreeModule} from "angular-tree-component/dist/angular-tree-component";
import {VenuesTreeViewComponent} from "./venues-tree-view/venues-tree-view.component";
import {ContentService} from "../content/content.service";
import {EditTreeViewNodeFormComponent} from "./edit-tree-view-node-form/edit-tree-view-node-form.component";
import {VenuesTreeViewService} from "./venues-tree-view/venues-tree-view.service";
import {ContentAutocompleteModule} from "../content-autocomplete/content-autocomplete.module";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";
import {SettingsModule} from "../settings/settings.module";
import {ScreensMessagingService} from "../messaging/screens-messaging.service";
import {ContentVenuesTreeViewComponent} from "./content-venues-tree-view/contnet-venues-tree-view.component";
import {MaintenanceVenuesTreeViewComponent} from "./maintaince-venues-tree-view/maintenance-venues-tree-view.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ContentAutocompleteModule,
        TreeModule,
        AutofocusModule,
        SettingsModule
    ],
    exports: [
        VenuesComponent,
        MaintenanceVenuesTreeViewComponent
    ],
    declarations: [
        VenuesComponent,
        VenuesTreeViewComponent,
        EditTreeViewNodeFormComponent,
        ContentVenuesTreeViewComponent,
        MaintenanceVenuesTreeViewComponent
    ],
    providers: [
        ContentService,
        ScreensMessagingService,
        VenuesTreeViewService
    ]
})
export class VenuesModule {

}

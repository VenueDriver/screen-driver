import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {TreeModule} from "angular-tree-component/dist/angular-tree-component";
import {VenueAutoUpdateScheduleSwitcherComponent} from "./venue-auto-update-schedule-switcher/venue-auto-update-schedule-switcher.component";
import {ContentAutocompleteModule} from "../../content-autocomplete/content-autocomplete.module";
import {AutofocusModule} from "../../directives/autofocus/autofocus.module";
import {SettingsModule} from "../../settings/settings.module";
import {MaintenanceVenuesTreeViewComponent} from "./maintenance-venues-tree-view.component";
import {VenuesModule} from "../../venues/venues.module";
import {TimeSelectorModule} from "../../shared/time-selector/time-selector.module";
import {KioskVersionDetailsComponent} from "./kiosk-version-details/kiosk-version-details.component";
import {DateFormatterModule} from "../../../pipes/date-formatter/date-formatter.module";
import {ToggleButtonModule} from "../../shared/toggle-button/toggle-button.module";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ContentAutocompleteModule,
        TreeModule,
        AutofocusModule,
        SettingsModule,
        VenuesModule,
        TimeSelectorModule,
        ToggleButtonModule,
        TimeSelectorModule,
        DateFormatterModule
    ],
    exports: [
        MaintenanceVenuesTreeViewComponent
    ],
    declarations: [
        MaintenanceVenuesTreeViewComponent,
        VenueAutoUpdateScheduleSwitcherComponent,
        KioskVersionDetailsComponent
    ],
    providers: []
})
export class MaintenanceVenuesTreeViewModule {

}

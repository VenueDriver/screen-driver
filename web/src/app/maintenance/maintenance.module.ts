import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaintenanceComponent} from './maintenance.component';
import {VenuesService} from "../content-management/venues/venues.service";
import {MaintenanceService} from "./maintenance.service";
import {ToggleButtonModule} from "../shared/toggle-button/toggle-button.module";
import {TimeSelectorModule} from "../shared/time-selector/time-selector.module";
import {VenuesModule} from "../content-management/venues/venues.module";
import {MaintenanceVenuesTreeViewModule} from "./maintenance-venues-tree-view/maintenance-venues-tree-view.module";
import {AutoupdateScheduleService} from "./autoupdate-schedule.service";
import {KioskVersionService} from "./kiosk-version.service";
import {ApiService} from "../shared/services/api.service";

@NgModule({
    imports: [
        CommonModule,
        ToggleButtonModule,
        TimeSelectorModule,
        VenuesModule,
        MaintenanceVenuesTreeViewModule
    ],
    declarations: [
        MaintenanceComponent,
    ],
    providers: [
        VenuesService,
        MaintenanceService,
        KioskVersionService,
        AutoupdateScheduleService,
        ApiService
    ]
})
export class MaintenanceModule {
}

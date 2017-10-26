import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaintenanceComponent} from './maintenance.component';
import {VenuesService} from "../venues/venues.service";
import {MaintenanceService} from "./maintenance.service";
import {ToggleButtonModule} from "../toggle-button/toggle-button.module";
import {TimeSelectorModule} from "../time-selector/time-selector.module";
import {VenuesModule} from "../venues/venues.module";
import {MaintenanceVenuesTreeViewModule} from "./maintenance-venues-tree-view/maintenance-venues-tree-view.module";
import {AutoupdateScheduleService} from "./autoupdate-schedule.service";
import {KioskVersionService} from "./kiosk-version.service";

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
        AutoupdateScheduleService
    ]
})
export class MaintenanceModule {
}

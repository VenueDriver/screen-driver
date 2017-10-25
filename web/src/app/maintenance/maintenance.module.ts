import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaintenanceComponent} from './maintenance.component';
import {VenuesComponent} from './venues/venues.component';
import {VenuesService} from "../venues/venues.service";
import {MaintenanceService} from "./maintenance.service";
import {ToggleButtonModule} from "../toggle-button/toggle-button.module";
import {TimeSelectorModule} from "../time-selector/time-selector.module";
import {AutoupdateScheduleService} from "./autoupdate-schedule.service";
import {KioskVersionService} from "./kiosk-version.service";

@NgModule({
    imports: [
        CommonModule,
        ToggleButtonModule,
        TimeSelectorModule
    ],
    declarations: [
        MaintenanceComponent,
        VenuesComponent
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

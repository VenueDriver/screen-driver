import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaintenanceComponent} from './maintenance.component';
import {VenuesService} from "../venues/venues.service";
import {MaintenanceService} from "./maintenance.service";
import {ToggleButtonModule} from "../toggle-button/toggle-button.module";
import {TimeSelectorModule} from "../time-selector/time-selector.module";
import {VenuesModule} from "../venues/venues.module";

@NgModule({
    imports: [
        CommonModule,
        ToggleButtonModule,
        TimeSelectorModule,
        VenuesModule
    ],
    declarations: [
        MaintenanceComponent,
    ],
    providers: [
        VenuesService,
        MaintenanceService
    ]
})
export class MaintenanceModule {
}

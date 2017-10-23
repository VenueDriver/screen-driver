import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaintenanceComponent} from './maintenance.component';
import {VenuesComponent} from './venues/venues.component';
import {VenuesService} from "../venues/venues.service";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [MaintenanceComponent, VenuesComponent],
    providers: [
        VenuesService
    ]
})
export class MaintenanceModule {
}

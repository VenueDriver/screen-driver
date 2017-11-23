import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataLoadingMonitorService} from "./data-loading-monitor.service";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        DataLoadingMonitorService
    ]
})
export class ApiRequestsMonitorModule {
}

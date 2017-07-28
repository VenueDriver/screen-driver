import {NgModule} from "@angular/core";
import {DatepickerModule} from "angular2-material-datepicker";
import {ScheduleCreatorComponent} from "./schedule-creator/schedule-creator.component";
import {BrowserModule} from "@angular/platform-browser";
import {AutocompleteModule} from "../autocomplete/autocomplete.module";
import {SchedulesService} from "./schedules.service";
import {SettingStateHolderService} from "../settings/setting-state-manager/settings-state-holder.service";
import {SchedulesComponent} from "./schedules.component";

@NgModule({
    imports: [
        BrowserModule,
        DatepickerModule,
        AutocompleteModule
    ],
    exports: [
        SchedulesComponent
    ],
    declarations: [
        SchedulesComponent,
        ScheduleCreatorComponent
    ],
    providers: [
        SchedulesService,
        SettingStateHolderService
    ]
})
export class SchedulesModule {

}
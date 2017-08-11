import {NgModule} from "@angular/core";
import {DatepickerModule} from "../datepicker/datepicker.module";
import {SingleScheduleComponent} from "./single-schedule/single-schedule.component";
import {BrowserModule} from "@angular/platform-browser";
import {AutocompleteModule} from "../autocomplete/autocomplete.module";
import {SchedulesService} from "./schedules.service";
import {SettingStateHolderService} from "../settings/setting-state-manager/settings-state-holder.service";
import {SchedulesComponent} from "./schedules.component";
import {ToggleButtonModule} from "../toggle-button/toggle-button.module";
import {CheckboxMultiselectorModule} from "../checkbox-multiselector/checkbox-multiselector.module";
import { DateMultiselectorComponent } from './single-schedule/days-of-week-multiselector/days-of-week-multiselector.component';

@NgModule({
    imports: [
        BrowserModule,
        DatepickerModule,
        AutocompleteModule,
        ToggleButtonModule,
        CheckboxMultiselectorModule
    ],
    exports: [
        SchedulesComponent
    ],
    declarations: [
        SchedulesComponent,
        SingleScheduleComponent,
        DateMultiselectorComponent
    ],
    providers: [
        SchedulesService,
        SettingStateHolderService
    ]
})
export class SchedulesModule {

}
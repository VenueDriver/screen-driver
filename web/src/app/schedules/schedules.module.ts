import {NgModule} from "@angular/core";
import {DatepickerModule} from "angular2-material-datepicker";
import {ScheduleCreatorComponent} from "./schedule-creator.component";
import {BrowserModule} from "@angular/platform-browser";
import {AutocompleteModule} from "../autocomplete/autocomplete.module";

@NgModule({
    imports: [
        BrowserModule,
        DatepickerModule,
        AutocompleteModule
    ],
    exports: [
        ScheduleCreatorComponent
    ],
    declarations: [
        ScheduleCreatorComponent
    ],
    providers: [

    ]
})
export class SchedulesModule {

}
import {NgModule} from "@angular/core";
import {DatepickerModule} from "angular2-material-datepicker";
import {ScheduleCreatorComponent} from "./schedule-creator.component";

@NgModule({
    imports: [
        DatepickerModule
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
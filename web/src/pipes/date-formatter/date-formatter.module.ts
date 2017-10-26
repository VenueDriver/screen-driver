import {NgModule} from "@angular/core";
import {DateFormatterPipe} from "./date-formatter.pipe";

@NgModule({
    declarations: [
        DateFormatterPipe
    ],
    exports: [
        DateFormatterPipe
    ]
})
export class DateFormatterModule {}
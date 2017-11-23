import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FullSizeSpinnerComponent} from './full-size-spinner.component';
import {SpinnerModule} from "../spinner/spinner.module";

@NgModule({
    imports: [
        CommonModule,
        SpinnerModule
    ],
    declarations: [
        FullSizeSpinnerComponent
    ],
    exports: [
        FullSizeSpinnerComponent
    ]
})
export class FullSizeSpinnerModule {
}

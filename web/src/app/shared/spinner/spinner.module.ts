import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SpinnerComponent} from './spinner.component';
import {SpinnerService} from './spinner.service';
import {UniqEntitySpinnerComponent} from './uniq-entity-spinner/uniq-entity-spinner.component';

@NgModule({
    imports: [
        BrowserModule
    ],
    exports: [
        SpinnerComponent,
        UniqEntitySpinnerComponent
    ],
    declarations: [
        SpinnerComponent,
        UniqEntitySpinnerComponent
    ],
    providers: [ SpinnerService ]
})
export class SpinnerModule {
}

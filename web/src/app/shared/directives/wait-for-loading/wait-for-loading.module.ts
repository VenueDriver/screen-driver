import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WaitForLoadingDirective} from './wait-for-loading.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [WaitForLoadingDirective],
    exports: [WaitForLoadingDirective]
})
export class WaitForLoadingModule {
}

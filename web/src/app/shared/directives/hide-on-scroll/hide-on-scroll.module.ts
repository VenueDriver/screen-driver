import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HideOnScrollDirective} from "./hide-on-scroll.directive";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [HideOnScrollDirective],
    exports: [HideOnScrollDirective]
})
export class HideOnScrollModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxMultiselectorComponent} from './ckeckbox-multiselector.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        CheckboxMultiselectorComponent,
    ],
    declarations: [CheckboxMultiselectorComponent]
})
export class CheckboxMultiselectorModule {
}

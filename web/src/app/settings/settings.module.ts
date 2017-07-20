import {NgModule} from "@angular/core";
import {SettingsComponent} from "./settings.component";
import {SettingCreatorComponent} from "./setting-creator/setting-creator.component";
import {SettingsService} from "./settings.service";
import {SettingStateHolderService} from "./setting-state-manager/settings-state-holder.service";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {DropdownModule} from "../dropdown/dropdown.module";
import {SettingsManagerComponent} from "./settings-manager/settings-manager.component";
import {ToggleButtonComponent} from "../toggle-button/toggle-button.component";
import { PriorityTypeTagComponent } from './priority-type-tag/priority-type-tag.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AutofocusModule,
        DropdownModule
    ],
    exports: [
        SettingsComponent,
        SettingCreatorComponent
    ],
    declarations: [
        SettingsComponent,
        SettingCreatorComponent,
        SettingsManagerComponent,
        ToggleButtonComponent,
        PriorityTypeTagComponent
    ],
    providers: [
        SettingsService,
        SettingStateHolderService
    ]
})
export class SettingsModule {

}
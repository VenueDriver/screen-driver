import {NgModule} from "@angular/core";
import {SettingsComponent} from "./settings.component";
import {SettingCreatorComponent} from "./setting-creator/setting-creator.component";
import {SettingsService} from "./settings.service";
import {SettingStateHolderService} from "./setting-state-manager/settings-state-holder.service";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {DropdownModule} from "../shared/dropdown/dropdown.module";
import {SettingsManagerComponent} from "./settings-manager/settings-manager.component";
import {PriorityTypeTagComponent} from "./priority-type-tag/priority-type-tag.component";
import {SettingHeaderComponent} from "./setting-header/setting-header.component";
import {SettingsPriorityHelper} from "./settings-priority.helper";
import {ToggleButtonModule} from "../shared/toggle-button/toggle-button.module";
import { SettingsGroupComponent } from './settings-group/settings-group.component';
import { SingleSettingComponent } from './single-setting/single-setting.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AutofocusModule,
        DropdownModule,
        ToggleButtonModule
    ],
    exports: [
        SettingsComponent,
        SettingCreatorComponent,
        PriorityTypeTagComponent,
        SettingHeaderComponent
    ],
    declarations: [
        SettingsComponent,
        SettingCreatorComponent,
        SettingsManagerComponent,
        PriorityTypeTagComponent,
        SettingHeaderComponent,
        SettingsGroupComponent,
        SingleSettingComponent,
    ],
    providers: [
        SettingsService,
        SettingStateHolderService,
        SettingsPriorityHelper
    ]
})
export class SettingsModule {

}

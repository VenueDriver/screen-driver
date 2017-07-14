import {NgModule} from "@angular/core";
import {ConfigurationsComponent} from "./configurations.component";
import {ConfigurationCreatorComponent} from "./configuration-creator/configuration-creator.component";
import {ConfigurationsService} from "./configurations.service";
import {ConfigStateHolderService} from "./configuration-state-manager/config-state-holder.service";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {ConfigurationManagerComponent} from "./configurations-manager/configurations-manager.component";
import {ToggleButtonComponent} from "../toggle-button/toggle-button/toggle-button.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AutofocusModule
    ],
    exports: [
        ConfigurationsComponent
    ],
    declarations: [
        ConfigurationsComponent,
        ConfigurationCreatorComponent,
        ConfigurationManagerComponent,
        ToggleButtonComponent
    ],
    providers: [
        ConfigurationsService,
        ConfigStateHolderService
    ]
})
export class ConfigurationsModule {

}
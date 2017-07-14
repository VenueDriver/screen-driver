import {NgModule} from "@angular/core";
import {ConfigurationsComponent} from "./configurations.component";
import {ConfigurationCreatorComponent} from "./configuration-creator/configuration-creator.component";
import {ConfigurationsService} from "./configurations.service";
import {ConfigStateHolderService} from "./configuration-state-manager/config-state-holder.service";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {DropdownModule} from "../dropdown/dropdown.module";
import {ConfigurationManagerComponent} from "./configurations-manager/configurations-manager.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AutofocusModule,
        DropdownModule
    ],
    exports: [
        ConfigurationsComponent
    ],
    declarations: [
        ConfigurationsComponent,
        ConfigurationCreatorComponent,
        ConfigurationManagerComponent
    ],
    providers: [
        ConfigurationsService,
        ConfigStateHolderService
    ]
})
export class ConfigurationsModule {

}
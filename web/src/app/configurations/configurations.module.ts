import {NgModule} from "@angular/core";
import {ConfigurationsComponent} from "./configurations.component";
import {ConfigurationCreatorComponent} from "./configuration-creator/configuration-creator.component";
import {ConfigurationsService} from "./configurations.service";
import {AutofocusModule} from "../directives/autofocus/autofocus.module";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

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
        ConfigurationCreatorComponent
    ],
    providers: [
        ConfigurationsService
    ]
})
export class ConfigurationsModule {

}
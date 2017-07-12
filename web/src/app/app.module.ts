import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {AlertModule} from "ngx-bootstrap";

import {VenuesModule} from "./venues/venues.module";
import {HeaderComponent} from "./header/header.component";
import {NotificationModule} from "./notifications/notification.module";
import {NotificationService} from "./notifications/notification.service";
import {HttpModule} from "@angular/http";
import {ConfigurationsModule} from "./configurations/configurations.module";

@NgModule({
    declarations: [
        HeaderComponent,
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        AlertModule.forRoot(),
        NotificationModule,
        VenuesModule,
        ConfigurationsModule
    ],
    providers: [
        NotificationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

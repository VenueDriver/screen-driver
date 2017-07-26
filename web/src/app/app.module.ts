import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {AlertModule} from "ngx-bootstrap";

import {VenuesModule} from "./venues/venues.module";
import {HeaderComponent} from "./header/header.component";
import {NotificationModule} from "./notifications/notification.module";
import {NotificationService} from "./notifications/notification.service";
import {HttpModule} from "@angular/http";
import {SettingsModule} from "./settings/settings.module";
import {HeaderService} from "./header/header.service";
import {TabbedSwitcherModule} from "./tabbed-switcher/tabbed-switcher.module";
import {ScreensMessagingModule} from "./messaging/screens-messaging.module";

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
        SettingsModule,
        TabbedSwitcherModule,
        SettingsModule,
        ScreensMessagingModule
    ],
    providers: [
        NotificationService,
        HeaderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

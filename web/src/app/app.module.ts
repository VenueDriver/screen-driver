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
import {SchedulesModule} from "./schedules/schedules.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ContentManagementComponent } from './content-management/content-management.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
    declarations: [
        HeaderComponent,
        AppComponent,
        ContentManagementComponent,
        UsersManagementComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        AlertModule.forRoot(),
        NotificationModule,
        VenuesModule,
        SettingsModule,
        TabbedSwitcherModule,
        SettingsModule,
        ScreensMessagingModule,
        SchedulesModule
    ],
    providers: [
        NotificationService,
        HeaderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

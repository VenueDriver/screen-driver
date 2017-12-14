import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {AlertModule} from "ngx-bootstrap";

import {VenuesModule} from "./content-management/venues/venues.module";
import {NotificationModule} from "./shared/notifications/notification.module";
import {NotificationService} from "./shared/notifications/notification.service";
import {SettingsModule} from "./settings/settings.module";
import {HeaderService} from "./header/header.service";
import {TabbedSwitcherModule} from "./shared/tabbed-switcher/tabbed-switcher.module";
import {ScreensMessagingModule} from "./shared/services/messaging/screens-messaging.module";
import {SchedulesModule} from "./content-management/schedules/schedules.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ContentManagementComponent } from './content-management/content-management.component';
import {AppRoutingModule} from "./app-routing.module";
import {UsersManagementModule} from "./users-management/users-management.module";
import {AuthModule} from "./auth/auth.module";
import {AuthHttpInterceptor} from "./auth/auth-http.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ProfileManagementModule} from "./profile-management/profile-management.module";
import {HeaderModule} from "./header/header.module";
import {MaintenanceModule} from "./maintenance/maintenance.module";
import {ApiService} from "./shared/services/api.service";
import {TitleService} from "./shared/services/title.service";
import {WaitForLoadingModule} from "./shared/directives/wait-for-loading/wait-for-loading.module";
import {DataLoadingMonitorService} from "./shared/services/data-loading-monitor/data-loading-monitor.service";
import {FullSizeSpinnerModule} from "./shared/full-size-spinner/full-size-spinner.module";
import {ContentListModule} from "./content/content-list.module";

@NgModule({
    declarations: [
        AppComponent,
        ContentManagementComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AlertModule.forRoot(),
        NotificationModule,
        VenuesModule,
        ContentListModule,
        SettingsModule,
        TabbedSwitcherModule,
        ScreensMessagingModule,
        SchedulesModule,
        UsersManagementModule,
        AuthModule,
        ProfileManagementModule,
        HeaderModule,
        MaintenanceModule,
        WaitForLoadingModule,
        FullSizeSpinnerModule,
    ],
    providers: [
        NotificationService,
        ApiService,
        HeaderService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true
        },
        TitleService,
        DataLoadingMonitorService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

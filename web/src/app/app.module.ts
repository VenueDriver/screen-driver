import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {routing} from "./app.routing";
import {AlertModule} from "ngx-bootstrap";

import {ContentListModule} from "./content/content-list.module";
import {VenuesModule} from "./venues/venues.module";
import {HeaderComponent} from "./header/header.component";
import {NotificationBarModule, NotificationBarService} from "angular2-notification-bar";
import {NotificationService} from "./notifications/notification.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    declarations: [
        HeaderComponent,
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        routing,
        AlertModule.forRoot(),
        ContentListModule,
        VenuesModule,
        NotificationBarModule
    ],
    providers: [
        NotificationBarService,
        NotificationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

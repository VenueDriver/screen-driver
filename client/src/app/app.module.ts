import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {routing} from "./app.routing";
import {AlertModule} from "ngx-bootstrap";

import {ContentListModule} from "./content/content-list.module";
import {VenuesModule} from "./venues/venues.module";
import {HeaderComponent} from "./header/header.component";

@NgModule({
    declarations: [
        HeaderComponent,
        AppComponent
    ],
    imports: [
        BrowserModule,
        routing,
        AlertModule.forRoot(),
        ContentListModule,
        VenuesModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

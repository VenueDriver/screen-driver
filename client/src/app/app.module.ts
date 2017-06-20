import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {routing} from "./app.routing";

import {ContentListModule} from "./content/content-list.module";
import {VenuesModule} from "./venues/venues.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        routing,
        ContentListModule,
        VenuesModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

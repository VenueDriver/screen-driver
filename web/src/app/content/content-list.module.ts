import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";
import {NgModule} from '@angular/core';
import {ContentListComponent} from "./content-list.component";
import {ContentRowComponent} from "./content-row/content-row.component";
import {ContentInfoComponent} from "./content-row/content-info/content-info.component";
import {ContentService} from "./content.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
    ],
    exports: [
        ContentListComponent,
    ],
    declarations: [
        ContentListComponent,
        ContentRowComponent,
        ContentInfoComponent,
    ],
    providers: [
        ContentService,
    ]
})
export class ContentListModule {

}

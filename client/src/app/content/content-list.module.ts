import {NgModule} from "@angular/core";
import {ContentListComponent} from "./content-list.component";
import { ContentRowComponent } from './content-row/content-row.component';
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
    imports: [
      BrowserModule
    ],
    exports: [
        ContentListComponent
    ],
    declarations: [
        ContentListComponent,
        ContentRowComponent
    ]
})
export class ContentListModule {

}

import {NgModule} from "@angular/core";
import {ContentListComponent} from "./content-list.component";
import { ContentRowComponent } from './content-row/content-row.component';
import {BrowserModule} from "@angular/platform-browser";
import {ContentService} from "./content.service";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
      BrowserModule,
      HttpModule,
      FormsModule
    ],
    exports: [
        ContentListComponent
    ],
    declarations: [
        ContentListComponent,
        ContentRowComponent
    ],
    providers: [ ContentService ]
})
export class ContentListModule {

}

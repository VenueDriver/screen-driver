import {NgModule} from "@angular/core";
import {VenuesComponent} from "./venues.component";
import {TreeModule} from "angular2-tree-component/dist/angular2-tree-component";

@NgModule({
    imports: [
        TreeModule
    ],
    exports: [
        VenuesComponent
    ],
    declarations: [
        VenuesComponent
    ]
})
export class VenuesModule {

}

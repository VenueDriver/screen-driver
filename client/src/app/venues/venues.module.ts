import {NgModule} from "@angular/core";
import {VenuesComponent} from "./venues.component";
import {TreeModule} from "angular2-tree-component/dist/angular2-tree-component";
import {VenuesTreeViewComponent} from "./venues-tree-view/venues-tree-view.component";

@NgModule({
    imports: [
        TreeModule
    ],
    exports: [
        VenuesComponent
    ],
    declarations: [
        VenuesComponent,
        VenuesTreeViewComponent
    ]
})
export class VenuesModule {

}

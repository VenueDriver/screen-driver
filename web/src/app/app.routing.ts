import {Routes, RouterModule} from "@angular/router";
import {VenuesComponent} from "./venues/venues.component";

const appRoutes: Routes = [
    {
        path: '',
        component: VenuesComponent
    }
];

export const routing = RouterModule.forRoot(appRoutes);

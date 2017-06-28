import {Routes, RouterModule} from "@angular/router";
import {VenuesComponent} from "./venues/venues.component";
import {ContentListComponent} from "./content/content-list.component";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/venues',
        pathMatch: 'full'
    },
    {
        path: 'venues',
        component: VenuesComponent
    },
    {
        path: 'content',
        component: ContentListComponent
    },
];

export const routing = RouterModule.forRoot(appRoutes);

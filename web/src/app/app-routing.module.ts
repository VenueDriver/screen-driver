import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UsersManagementComponent} from "./users-management/users-management.component";
import {ContentManagementComponent} from "./content-management/content-management.component";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/content',
        pathMatch: 'full'
    },
    {
        path: 'content',
        component: ContentManagementComponent,
        data: {isSidebarHidden: true}
    },
    {
        path: 'users',
        component: UsersManagementComponent,
        data: {isSidebarHidden: false}
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}

import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UsersManagementComponent} from "./users-management/users-management.component";
import {ContentManagementComponent} from "./content-management/content-management.component";
import {AuthComponent} from "./auth/auth-page/auth.component";
import {CanActivateUser} from "./auth/auth-guards/can-acticate-user";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/content',
        pathMatch: 'full'
    },
    {
        path: 'content',
        component: ContentManagementComponent,
        data: {isSidebarDisplayed: true},
        canActivate: [CanActivateUser]
    },
    {
        path: 'users',
        component: UsersManagementComponent,
        data: {isSidebarDisplayed: false},
        canActivate: [CanActivateUser]
    },
    {
        path: 'auth',
        component: AuthComponent,
        data: {isSidebarDisplayed: false}
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {useHash: true}
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [CanActivateUser]
})
export class AppRoutingModule {
}


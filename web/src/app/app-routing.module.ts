import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UsersManagementComponent} from "./users-management/users-management.component";
import {ContentManagementComponent} from "./content-management/content-management.component";
import {AuthComponent} from "./auth/auth-page/auth.component";
import {CanActivateUser} from "./auth/auth-guards/can-acticate-user";
import {CanActivateAdmin} from "./auth/auth-guards/can-acticate-admin";
import {ProfileManagementComponent} from "./profile-management/profile-management.component";

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
        path: 'profile',
        component: ProfileManagementComponent,
        data: {isSidebarDisplayed: false},
        canActivate: [CanActivateUser]
    },
    {
        path: 'users',
        component: UsersManagementComponent,
        data: {isSidebarDisplayed: false},
        canActivate: [CanActivateAdmin]
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
    providers: [
        CanActivateUser,
        CanActivateAdmin
    ]
})
export class AppRoutingModule {
}


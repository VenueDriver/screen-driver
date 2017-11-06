import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UsersManagementComponent} from "./users-management/users-management.component";
import {ContentManagementComponent} from "./content-management/content-management.component";
import {AuthComponent} from "./auth/auth-page/auth.component";
import {CanActivateUser} from "./auth/auth-guards/can-acticate-user";
import {CanActivateAdmin} from "./auth/auth-guards/can-acticate-admin";
import {ProfileManagementComponent} from "./profile-management/profile-management.component";
import {MaintenanceComponent} from "./maintenance/maintenance.component";
import {SignInComponent} from "./auth/auth-page/sign-in/sign-in.component";
import {ResetPasswordComponent} from "./auth/auth-page/reset-password/reset-password.component";

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
        data: {isSidebarDisplayed: false},
        children: [
            {path: '', component: SignInComponent},
            {path: 'reset-password', component: ResetPasswordComponent}
        ]
    },
    {
        path: 'maintenance',
        component: MaintenanceComponent,
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


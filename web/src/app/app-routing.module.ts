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
import {FirstSignInComponent} from "./auth/auth-page/first-sign-in/first-sign-in.component";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/content',
        pathMatch: 'full'
    },
    {
        path: 'content',
        component: ContentManagementComponent,
        data: {isSidebarDisplayed: true, title: 'Content'},
        canActivate: [CanActivateUser]
    },
    {
        path: 'profile',
        component: ProfileManagementComponent,
        data: {isSidebarDisplayed: false, title: 'Profile'},
        canActivate: [CanActivateUser]
    },
    {
        path: 'users',
        component: UsersManagementComponent,
        data: {isSidebarDisplayed: false, title: 'Users'},
        canActivate: [CanActivateAdmin]
    },
    {
        path: 'auth',
        component: AuthComponent,
        data: {isSidebarDisplayed: false, title: 'Authentication'},
        children: [
            {
                path: '',
                component: SignInComponent,
                data: {title: 'Sign in'},
                pathMatch: 'full'
            },
            {
                path: 'first',
                component: FirstSignInComponent,
                data: {title: 'Sign in'}
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
                data: {title: 'Reset Password'}
            }
        ]
    },
    {
        path: 'maintenance',
        component: MaintenanceComponent,
        data: {isSidebarDisplayed: false, title: 'Maintenance'},
        canActivate: [CanActivateUser]
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


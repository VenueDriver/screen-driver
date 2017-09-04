import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UsersManagementComponent} from "./users-management/users-management.component";
import {ContentManagementComponent} from "./content-management/content-management.component";
import {AuthComponent} from "./auth/auth.component";
import {AuthGuard} from "./auth/auth.guard";

import * as AuthConsts from "./auth/auth-consts";
import * as _ from "lodash";


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/content',
        pathMatch: 'full'
    },
    {
        path: 'content',
        component: ContentManagementComponent,
        data: {isSidebarDisplayed: true}
    },
    {
        path: 'users',
        component: UsersManagementComponent,
        data: {isSidebarDisplayed: false}
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
            addCanActivateParameter(),
            {useHash: true}
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [AuthGuard]
})
export class AppRoutingModule {
}

function addCanActivateParameter() {
    _.filter(appRoutes, r => {
        return !AuthConsts.EXCLUSIVE_URLS.includes(r.path);
    })
        .forEach(r => r.canActivate = [AuthGuard]);
    return appRoutes;
}

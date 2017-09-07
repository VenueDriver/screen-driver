import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "./auth.service";

import * as AuthConsts from "./auth-consts";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router) {
    }

    canActivate() {
        if (this.authService.authenticated()) {
            return this.hasAccess();
        }

        this.authService.saveCurrentUrlAsRollback();
        this.router.navigateByUrl(AuthConsts.AUTH_URI);
        return false;
    }

    hasAccess(): boolean {
        if (!this.authService.isAdmin() && this.authService.getCurrentPageUri() === AuthConsts.USERS_URI){
            this.router.navigateByUrl('');
            return false;
        }
        return true;
    }
}

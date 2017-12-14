import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "../auth.service";

import * as AuthConsts from "../auth-consts";

@Injectable()
export class CanActivateAdmin implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router) {
    }

    canActivate() {
        let authenticated = this.authService.authenticated();
        let admin = this.authService.isAdmin();

        if (authenticated && admin) {
            return true;
        }

        if (authenticated) {
            this.router.navigateByUrl('/');
            return true;
        }

        this.navigateToAuthPage();
        return false;
    }

    private navigateToAuthPage() {
        this.authService.saveCurrentUrlAsRollback();
        this.router.navigateByUrl(AuthConsts.AUTH_URI);
    }
}

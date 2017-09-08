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
        if (this.authService.isAdmin()) {
            return true;
        }

        if (this.authService.authenticated()) {
            this.router.navigateByUrl(AuthConsts.CONTENT_URI);
            return true;
        }

        this.authService.saveCurrentUrlAsRollback();
        this.router.navigateByUrl(AuthConsts.AUTH_URI);
        return false;
    }
}

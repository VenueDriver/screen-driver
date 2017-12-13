import { Injectable } from '@angular/core';
import {Subject, BehaviorSubject, Observable} from "rxjs";
import {UserRole} from "../auth/user-roles";
import {NavBarLink} from "./nav-bar-link.interface";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class HeaderService {

    private sidebarToggle: Subject<any> = new BehaviorSubject({});

    constructor(private authService: AuthService) { }

    getSideBarToggleSubscription(): Observable<any> {
        return this.sidebarToggle;
    }

    pushSidebarToggleEvent() {
        this.sidebarToggle.next();
    }

    isAbleToShowRoute(link: NavBarLink): boolean {
        if (link.permittedFor === UserRole.ALL || UserRole.OPERATOR) {
            return true;
        }
        return link.permittedFor === UserRole.ADMIN && this.isUserAdmin();
    }

    isUserAdmin(): boolean {
        return this.authService.isAdmin();
    }


}
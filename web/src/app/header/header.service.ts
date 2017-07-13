import { Injectable } from '@angular/core';
import {Subject, BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class HeaderService {

    private sidebarToggle: Subject<any> = new BehaviorSubject({});

    constructor() { }

    getSideBarToggleSubscription(): Observable<any> {
        return this.sidebarToggle;
    }

    pushSidebarToggleEvent() {
        this.sidebarToggle.next();
    }

}
import { Component } from '@angular/core';
import {HeaderService} from "../header.service";
import {AuthService} from "../../auth/auth.service";
import {HeaderComponent} from "../header.component";

@Component({
    selector: 'screen-driver-mobile-header',
    templateUrl: 'mobile-header.component.html',
    styleUrls: [
        '../header.component.sass',
        'mobile-header.component.sass'
    ]
})
export class MobileHeaderComponent extends HeaderComponent {

    constructor(
        headerService: HeaderService,
        authService: AuthService
    ) {
        super(headerService, authService);
    }

}

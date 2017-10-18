import {Component, HostListener} from '@angular/core';
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

    private topHeader;

    constructor(
        headerService: HeaderService,
        authService: AuthService
    ) {
        super(headerService, authService);
    }

    ngOnInit() {
        this.topHeader = document.getElementById('pull-top');
    }

    @HostListener('window:scroll')
    onScroll() {
        this.topHeader.style.display = window.pageYOffset > 30 ? 'none' : 'block';
    }

}

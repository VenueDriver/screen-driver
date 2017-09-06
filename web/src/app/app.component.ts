import {Component} from '@angular/core';
import {AuthService} from "./auth/auth.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent {

    title = 'app';

    constructor(private authService: AuthService) {
    }

    isSidebarDisplayed(): boolean {
        return this.authService.isCurrentPath('/content');
    }

}

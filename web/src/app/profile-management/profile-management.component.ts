import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../user/user";

@Component({
    selector: 'profile-management',
    templateUrl: './profile-management.component.html',
    styleUrls: ['./profile-management.component.sass']
})
export class ProfileManagementComponent implements OnInit {
    user: User;

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.user = this.authService.currentUser.getValue()
    }

}

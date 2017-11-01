import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {User} from "../core/entities/user";

@Component({
    selector: 'profile-management',
    templateUrl: './profile-management.component.html',
    styleUrls: ['./profile-management.component.sass']
})
export class ProfileManagementComponent implements OnInit {
    @Output() cancel = new EventEmitter();
    user: User;
    isChangePasswordMode: boolean = false;

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.currentUser.subscribe(user => this.user = user);
    }

    setChangePasswordMode(mode: boolean) {
        this.isChangePasswordMode = mode;
    }

    performCancel() {
        this.cancel.emit();
    }

}

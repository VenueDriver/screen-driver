import {Component, Input} from '@angular/core';
import {User} from "../../user/user";

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent {
    @Input() user: User;
    isEditEmailMode: boolean = false;

    constructor() {
    }

    getUserRole(): string {
        return this.user.isAdmin ? 'Administrator' : 'Operator';
    }

    changeEditEmailMode(flag: boolean) {
        this.isEditEmailMode = flag;
    }

    performCancel() {
        this.changeEditEmailMode(false);
    }

    performSubmit() {

    }
}

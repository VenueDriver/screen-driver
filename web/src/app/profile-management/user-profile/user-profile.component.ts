import {Component, Input} from '@angular/core';
import {User} from "../../user/user";

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent {
    @Input() user: User;

    constructor() {
    }

    getUserRole(): string {
        return this.user.isAdmin ? 'Administrator' : 'Operator';
    }
}

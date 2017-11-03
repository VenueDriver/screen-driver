import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'reset-password-request',
    templateUrl: './reset-password-request.component.html',
    styleUrls: ['../../auth.component.sass']
})
export class ResetPasswordRequestComponent implements OnInit {

    @Input() email: string;

    constructor() {
    }

    ngOnInit() {
    }

}

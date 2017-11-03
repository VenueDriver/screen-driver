import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'reset-password-confirm',
    templateUrl: './reset-password-confirm.component.html',
    styleUrls: ['./reset-password-confirm.component.sass']
})
export class ResetPasswordConfirmComponent implements OnInit {
    @Input() email: string;

    constructor() {
    }

    ngOnInit() {
    }

}

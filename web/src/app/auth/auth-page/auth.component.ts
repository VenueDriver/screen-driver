import {Component, OnInit} from '@angular/core';
import {User} from "../../core/entities/user";
import {AuthService} from "../auth.service";
import {NgModel} from "@angular/forms";
import {ErrorMessageExtractor} from "../../core/error-message-extractor";

import * as _ from 'lodash';

@Component({
    selector: 'app-auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.sass']
})
export class AuthComponent implements OnInit {


    constructor() {
    }

    ngOnInit() {
    }



}

import {Injectable} from "@angular/core";

import * as AuthConsts from "../../auth-consts";
import {Observable} from "rxjs/Observable";
import {ApiService} from "../../../shared/services/api.service";

@Injectable()
export class ResetPasswordService {

    constructor(private apiService: ApiService) {

    }

    sendResetPasswordRequest(email: {email: string}): Observable<any> {
        return this.apiService.post(AuthConsts.RESET_PASSWORD_API, email);
    }

    sendResetPasswordConfirmation(requestParams: {email: string, verificationCode: string, password: string}) {
        return this.apiService.post(AuthConsts.CONFIRM_RESET_PASSWORD_API, requestParams);
    }
}
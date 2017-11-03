import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import * as AuthConsts from "../../auth-consts";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ResetPasswordService {

    constructor(private httpClient: HttpClient) {

    }

    sendResetPasswordRequest(email: {email: string}): Observable<any> {
        return this.httpClient.post(AuthConsts.RESET_PASSWORD_API, email);
    }

    sendResetPasswordConfirmation(requestParams: {email: string, verificationCode: string, password: string}) {
        return this.httpClient.post(AuthConsts.CONFIRM_RESET_PASSWORD_API, requestParams);
    }
}
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import * as AuthConsts from "../../../auth-consts";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ResetPasswordRequestService {

    constructor(private httpClient: HttpClient) {

    }

    sendResetPasswordRequest(email: {email: string}): Observable<any> {
        return this.httpClient.post(AuthConsts.RESET_PASSWORD_API, email);
    }
}
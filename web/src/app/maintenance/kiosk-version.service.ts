import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {KioskVersionDetails, KioskVersionDetailsMap} from "./entities/kiosk-version-details";

import * as _ from 'lodash';

@Injectable()
export class KioskVersionService {

    readonly apiPath = `${environment.apiUrl}/api/screens/versions`;

    constructor(private httpClient: HttpClient) { }

    loadKioskVersions(): Observable<KioskVersionDetailsMap> {
        return this.httpClient.get(this.apiPath)
            .map((data: Array<KioskVersionDetails>) => this.createKioskVersionsMap(data));
    }

    createKioskVersionsMap(kioskVersions: Array<KioskVersionDetails>): any {
        let versionsMap = {};
        _.each(kioskVersions, v => versionsMap[v.screenId] = v);
        return versionsMap;
    }
}

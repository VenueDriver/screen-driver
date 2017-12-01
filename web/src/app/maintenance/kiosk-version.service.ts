import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {KioskVersionDetails, KioskVersionDetailsMap} from "./entities/kiosk-version-details";

import * as _ from 'lodash';
import {ApiService} from "../shared/services/api.service";

@Injectable()
export class KioskVersionService {

    readonly apiPath = `/api/screens/versions`;

    constructor(private apiService: ApiService) { }

    loadKioskVersions(): Observable<KioskVersionDetailsMap> {
        return this.apiService.get(this.apiPath)
            .map(this.createKioskVersionsMap);
    }

    createKioskVersionsMap(kioskVersions: Array<KioskVersionDetails>): KioskVersionDetailsMap {
        let versionsMap = {};
        _.each(kioskVersions, v => versionsMap[v.screenId] = v);
        return versionsMap;
    }
}

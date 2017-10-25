import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class KioskVersionService {

    readonly apiPath = `${environment.apiUrl}/api/screens/versions`;

    constructor(private httpClient: HttpClient) { }

    loadKioskVersions(): Observable<any> {
        return this.httpClient.get(this.apiPath);
    }
}

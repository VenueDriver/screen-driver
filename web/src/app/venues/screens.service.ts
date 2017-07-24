import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable()
export class ScreensService {
    readonly screensApiPath = `${environment.apiUrl}/api/screens`;

    constructor(private http: Http) {
    }

    refreshScreen(id: string): Observable<any> {
        let data = {screens: [id]};
        return this.http.post(this.screensApiPath + '/reload', data);
    }
}

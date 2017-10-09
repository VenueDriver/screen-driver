import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ScreensMessagingService {
    readonly screensApiPath = `${environment.apiUrl}/api/screens`;

    constructor(private httpClient: HttpClient) {
    }

    refreshScreen(id: string): Observable<any> {
        let data = {screens: [id]};
        return this.httpClient.post(this.screensApiPath + '/refresh', data);
    }


    updateClients(content: any): Observable<any> {
        return this.httpClient.post(this.screensApiPath + '/update', content);
    };
}

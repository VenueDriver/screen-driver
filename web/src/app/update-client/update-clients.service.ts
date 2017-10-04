import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {Observable} from "rxjs";

import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class UpdateClientsService {

    readonly updateClientApiPath = `${environment.apiUrl}/api/screens/update`;

    constructor(private httpClient: HttpClient) { }

    updateClients(content: any): Observable<any> {
        return this.httpClient.post(this.updateClientApiPath, content)
    };
}

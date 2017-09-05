import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {Content} from "./content";

import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ContentService {

    readonly contentApiPath = `${environment.apiUrl}/api/content`;

    private contentUpdate: Subject<any> = new BehaviorSubject({});

    constructor(private httpClient: HttpClient) { }

    getContent(): Observable<Array<Content>> {
        return this.httpClient.get(this.contentApiPath)
    }

    createContent(content: Content): Observable<Content> {
        return this.httpClient.post(this.contentApiPath, content)
    }

    updateContent(content: Content): Observable<Content> {
        return this.httpClient.put(`${this.contentApiPath}/${content.id}`, content)
    }

    pushContentUpdateEvent() {
        this.contentUpdate.next();
    }

    getContentUpdateSubscription(): Observable<any> {
        return this.contentUpdate;
    }
}

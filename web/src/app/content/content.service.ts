import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {Content} from "./content";

import 'rxjs/add/operator/map';
import {ApiService} from "../shared/services/api.service";

@Injectable()
export class ContentService {

    readonly contentApiPath = '/api/content';

    private contentUpdate: Subject<any> = new BehaviorSubject({});

    constructor(private apiService: ApiService) { }

    getContent(): Observable<Array<Content>> {
        return this.apiService.get(this.contentApiPath)
    }

    createContent(content: Content): Observable<Content> {
        return this.apiService.post(this.contentApiPath, content)
    }

    updateContent(content: Content): Observable<Content> {
        return this.apiService.put(`${this.contentApiPath}/${content.id}`, content)
    }

    pushContentUpdateEvent() {
        this.contentUpdate.next();
    }

    getContentUpdateSubscription(): Observable<any> {
        return this.contentUpdate;
    }
}

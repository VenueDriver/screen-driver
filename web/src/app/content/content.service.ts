import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import { environment } from '../../environments/environment';
import {Observable} from "rxjs";
import {Content} from "./content";

import 'rxjs/add/operator/map';

@Injectable()
export class ContentService {
  readonly contentApiPath = `${environment.apiUrl}/api/content`;

  constructor(private http: Http) { }

  getContent(): Observable<Content[]> {
    return this.http.get(this.contentApiPath)
      .map(this.extractData);
  }

  createContent(content: Content): Observable<Content> {
    return this.http.post(this.contentApiPath, content)
        .map(this.extractData);
  }

  updateContent(content: Content): Observable<Content> {
    return this.http.put(`${this.contentApiPath}/${content.id}`, content)
        .map(this.extractData);
  }

  private extractData(res: Response) {
    return res.json() || { };
  }
}

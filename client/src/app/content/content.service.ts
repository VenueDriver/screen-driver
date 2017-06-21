import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Content} from "./content";

@Injectable()
export class ContentService {

  constructor(private http: Http) { }

  getContent(): Observable<Content[]> {
    return this.http.get("")
      .map(this.extractData);
  }

  private extractData(res: Response) {
    return res.json() || { };
  }
}

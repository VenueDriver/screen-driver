import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Venue} from "./entities/venue";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VenuesService {

    constructor(private http: Http) { }

    loadVenues(): Observable<Response> {
        return this.http.get('/venues');
    }

    getVenuesForTree(venues: Venue[]) {
        let venuesTree: Array<any>;
        venuesTree = venues;
        this.convertToTree(venuesTree);
        return venuesTree;
    }

    private convertToTree(items: Array<any>) {
        items.forEach(item => {
            if (item.screen_groups) {
                item.children = item.screen_groups;
                delete item.screen_groups;
            }
            if (item.screens) {
                item.children = item.screens;
                delete item.screens;
            }
            if (item.children) {
                this.convertToTree(item.children);
            }
        })
    }
}

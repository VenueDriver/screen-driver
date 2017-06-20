import { Component, OnInit } from '@angular/core';
import {Content} from "./content";

@Component({
    selector: 'content-list',
    templateUrl: 'content-list.component.html',
    styleUrls: ['./content-list.component.sass']
})
export class ContentListComponent implements OnInit {
    content: Array<Content> = [];

    constructor() {}

    ngOnInit() {
      this.content.push({
          id: "id",
          short_name: "citizenslasvegas.com",
          url: "http://touchscreen.citizenslasvegas.com/"
        },
        {
          id: "id2",
          short_name: "searsucker.com",
          url: "http://touchscreen.searsucker.com/"
        })
    }

}

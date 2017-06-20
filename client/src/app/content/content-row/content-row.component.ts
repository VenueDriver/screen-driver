import { Component, OnInit, Input } from '@angular/core';
import {Content} from "../content";

@Component({
  selector: 'content-row',
  templateUrl: './content-row.component.html',
  styleUrls: ['./content-row.component.sass']
})
export class ContentRowComponent implements OnInit {

  constructor() { }

  @Input() content: Array<Content>;

  ngOnInit() {
  }

}

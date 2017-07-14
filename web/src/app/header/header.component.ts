import { Component, OnInit } from '@angular/core';
import {HeaderService} from "./header.service";

@Component({
    selector: 'screen-driver-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {
  
    constructor(private headerService: HeaderService) { }

    ngOnInit() { }

    toggleSideBar() {
        this.headerService.pushSidebarToggleEvent();
    }
    
}

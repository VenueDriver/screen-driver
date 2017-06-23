import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'dropdown',
    templateUrl: 'dropdown.component.html',
    styleUrls: ['dropdown.component.sass']
})
export class DropdownComponent implements OnInit {

    @Input() items: any;
    @Input() buttonName: string;

    constructor() { }

    ngOnInit() { }

    getItems() {
        return this.items;
    }
}
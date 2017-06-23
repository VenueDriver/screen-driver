import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'dropdown',
    templateUrl: 'dropdown.component.html',
    styleUrls: ['dropdown.component.sass']
})
export class DropdownComponent implements OnInit {

    @Input() items: any;
    @Input() defaultValue: string;

    @Output() select = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    getItems() {
        return this.items;
    }

    selectItem(item: any) {
        this.defaultValue = item.name;
        this.select.emit(item);
    }
}
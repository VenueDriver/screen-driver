import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'dropdown',
    templateUrl: 'dropdown.component.html',
    styleUrls: ['dropdown.component.sass']
})
export class DropdownComponent implements OnInit {

    @Input() items: any;
    @Input() dropdownValue: string;

    @Output() select = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    getItems() {
        return this.items;
    }

    selectItem(item: any) {
        this.dropdownValue = item.name;
        this.select.emit(item);
        console.log(item)
    }
}
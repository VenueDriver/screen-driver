import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'dropdown',
    templateUrl: 'dropdown.component.html',
    styleUrls: ['dropdown.component.sass']
})
export class DropdownComponent implements OnInit {

    @Input() items: any;
    @Input() dropdownValue: string;
    @Input() selected: number;

    @Output() select = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
        this.initDefaultItem();
    }

    private initDefaultItem() {
        if (this.selected) {
            this.selectItem(this.items[this.selected])
        } else {
            console.log('select first on init', this.selected)
            this.selectItem(this.items[0]);
        }
    }

    getItems() {
        return this.items;
    }

    selectItem(item: any) {
        console.log('selected from dropdown', item)
        this.dropdownValue = item.name;
        this.select.emit(item);
    }
}

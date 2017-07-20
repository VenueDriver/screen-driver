import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'dropdown',
    templateUrl: 'dropdown.component.html',
    styleUrls: ['dropdown.component.sass']
})
export class DropdownComponent implements OnInit {

    @Input() items: any;
    @Input() dropdownValue: string;
    @Input() selected: any;

    @Output() select = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
        this.initDefaultItem();
    }

    private initDefaultItem() {
        if (this.selected) {
            let foundType = this.items.find(item => item.id === this.selected);
            this.selectItem(foundType);
        } else {
            this.selectItem(this.items[0]);
        }
    }

    getItems() {
        return this.items;
    }

    selectItem(item: any) {
        this.dropdownValue = item.name;
        this.select.emit(item);
    }
}

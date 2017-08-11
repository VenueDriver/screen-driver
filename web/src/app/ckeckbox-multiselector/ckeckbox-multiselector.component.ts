import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'checkbox-multiselector',
    templateUrl: 'ckeckbox-multiselector.component.html',
    styleUrls: ['ckeckbox-multiselector.component.sass']
})
export class CheckboxMultiselectorComponent implements OnInit {
    @Input() itemsMap: any;
    @Output() changed = new EventEmitter();
    items;

    constructor() {
    }

    ngOnInit() {
        this.items = this.getItems();
    }

    getItems() {
        let values = [];
        for (let item in this.itemsMap) {
            values.push({title: item, value: this.itemsMap[item], checked: false})
        }
        return values;
    }

    checkItem(item) {
        item.checked = !item.checked;
        this.changed.emit(this.items);
    }
}

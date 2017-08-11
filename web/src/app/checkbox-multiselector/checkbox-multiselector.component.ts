import {Component, OnInit, Input, EventEmitter, Output} from "@angular/core";

@Component({
    selector: 'checkbox-multiselector',
    templateUrl: 'checkbox-multiselector.component.html',
    styleUrls: ['checkbox-multiselector.component.sass']
})
export class CheckboxMultiselectorComponent implements OnInit {
    @Input() items: Array<any>;
    @Input() titleField: string;
    @Input() checkField: string;
    @Output() changed = new EventEmitter();
    convertedItems;

    constructor() {
    }

    ngOnInit() {
        this.convertedItems = this.getItems();
    }

    getItems() {
        let values = [];
        this.items.forEach(item => {
            values.push({title: item[this.titleField], value: item, checked: item[this.checkField]})
        });
        return values;
    }

    checkItem(item) {
        console.log(item);
        item.checked = !item.checked;
        this.changed.emit(this.items);
    }
}

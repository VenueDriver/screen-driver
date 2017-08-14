import {Component, OnInit, Input, EventEmitter, Output} from "@angular/core";

@Component({
    selector: 'checkbox-multiselector',
    templateUrl: 'checkbox-multiselector.component.html',
    styleUrls: ['checkbox-multiselector.component.sass']
})
export class CheckboxMultiselectorComponent implements OnInit {
    @Input('items') set _items(items: Array<any>) {
        this.items = this.convertItems(items);
    };
    @Input() titleField = 'title';
    @Input() selectedField = 'selected';
    @Input() editMode = false;
    @Output() changed = new EventEmitter();

    items: Array<any>;

    ngOnInit() {

    }

    convertItems(items) {
        let values = [];
        items.forEach(item => {
            values.push({title: item[this.titleField], value: item, selected: item[this.selectedField]})
        });
        return values;
    }

    checkItem(item) {
        if (this.editMode) {
            item.selected = !item.selected;
            this.changed.emit(this.items);
        }
    }
}

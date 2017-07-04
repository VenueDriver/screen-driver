import {Component, Output, EventEmitter, Input} from '@angular/core';
import {Content} from "../content/content";

import * as _ from 'lodash';

@Component({
    selector: 'content-autocomplete',
    templateUrl: 'content-autocomplete.component.html',
    styleUrls: ['content-autocomplete.component.sass']
})
export class ContentAutocompleteComponent {

    @Input() dropdownValue: any;
    @Input() placeholder: string;
    @Input() content: Array<Content>;

    @Output() select = new EventEmitter();

    data: Array<any>;

    constructor() {
    }

    handleFilter(value) {
        this.data = this.content.filter((s) => s.short_name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    onSelect(value) {
        let selectedValue = _.find(this.content, ['short_name', value]);
        if (selectedValue) {
            this.select.emit(selectedValue);
        }
    }
}
import {Component, Output, EventEmitter, Input} from '@angular/core';
import {Content} from "../content/content";

import * as _ from 'lodash';

@Component({
    selector: 'content-autocomplete',
    templateUrl: 'content-autocomplete.component.html',
    styleUrls: ['content-autocomplete.component.sass']
})
export class ContentAutocompleteComponent {

    @Input() value: any;
    @Input() placeholder: string;
    @Input() content: Array<Content>;

    @Output() select = new EventEmitter();

    data: Array<Content>;

    constructor() {
    }

    handleFilter(value) {
        value = value.toLowerCase();
        this.data = _.filter(this.content, c => c.short_name.toLowerCase().indexOf(value) !== -1);
    }

    onSelect(value: string) {
        let selectedValue = _.find(this.content, ['short_name', value]);
        if (selectedValue) {
            this.select.emit(selectedValue);
        }
    }
}
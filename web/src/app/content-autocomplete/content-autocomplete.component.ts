import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {Content} from "../content/content";
import {AutoCompleteComponent} from "@progress/kendo-angular-dropdowns";

import * as _ from 'lodash';

@Component({
    selector: 'content-autocomplete',
    templateUrl: 'content-autocomplete.component.html',
    styleUrls: ['content-autocomplete.component.sass']
})
export class ContentAutocompleteComponent {

    @Input() value: any;
    @Input() placeholder: string;
    @Input('content') set model(content: Array<Content>) {
        this.content = content;
        this.data = [...content];
    }

    @Output() select = new EventEmitter();
    @Output() add = new EventEmitter();

    @ViewChild(AutoCompleteComponent)
    private autocomplete: AutoCompleteComponent;

    content: Array<Content>;
    data: Array<Content>;
    filter: string;

    handleFilter(value) {
        this.filter = value;
        if (!value) {
            this.showAll();
            return;
        }
        value = value.toLowerCase();
        this.data = _.filter(this.content, c => c.short_name.toLowerCase().indexOf(value) !== -1);
    }

    showAll() {
        this.data = [...this.content];
        this.openPopup();
    }

    onSelect(value: string) {
        let selectedValue = _.find(this.content, ['short_name', value]);
        if (selectedValue) {
            this.select.emit(selectedValue);
        }
    }

    openPopup() {
        this.autocomplete.toggle(true);
    }

    emitAddNewEvent() {
        this.add.emit({short_name: this.filter});
    }
}
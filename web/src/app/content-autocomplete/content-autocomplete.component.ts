import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {Content} from "../content/content";

import * as _ from 'lodash';

@Component({
    selector: 'content-autocomplete',
    templateUrl: 'content-autocomplete.component.html',
    styleUrls: ['content-autocomplete.component.sass']
})
export class ContentAutocompleteComponent {

    @Input() value: any;
    @Input('content') set model(content: Array<Content>) {
        this.content = content;
        this.data = [...content];
    }

    @Output() select = new EventEmitter();
    @Output() add = new EventEmitter();

    content: Array<Content>;
    data: Array<Content>;
    filter: string;
    isShowDropdown = false;

    getValue(): string {
        return this.value && this.value.short_name ? this.value.short_name : '';
    }

    handleFilter() {
        this.filter = this.value.short_name;
        if (!this.filter) {
            this.showAll();
            return;
        }
        this.performFiltering(this.filter);
    }

    showAll() {
        this.data = [...this.content];
        this.showDropdown();
    }

    performFiltering(value) {
        value = value.toLowerCase();
        this.data = _.filter(this.content, c => c.short_name.toLowerCase().indexOf(value) !== -1);
        return value;
    }

    onSelect(content: Content) {
        if (content) {
            this.select.emit(content);
        }
    }

    emitAddNewEvent() {
        this.add.emit({short_name: this.filter});
    }

    showDropdown() {
        this.isShowDropdown = true;
    }

    hideDropdown() {
        this.isShowDropdown =false;
    }
}
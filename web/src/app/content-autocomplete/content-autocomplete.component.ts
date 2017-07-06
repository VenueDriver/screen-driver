import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {Content} from "../content/content";

import * as _ from 'lodash';

const DROPDOWN_ITEM_CLASS = 'dropdown-item';

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

    handleClickOutside(event: any) {
        let targetElement = event.target;
        if (!this.isDropdownItem(targetElement) && !this.isParentDropdownItem(targetElement)) {
            this.hideDropdown();
        }
    }

    isDropdownItem(element: any): boolean {
        return element.className.includes(DROPDOWN_ITEM_CLASS);
    }

    isParentDropdownItem(element: any): boolean {
        let parentElement = element.parentElement;
        return parentElement && parentElement.className.includes(DROPDOWN_ITEM_CLASS);
    }

    hideDropdown() {
        this.isShowDropdown = false;
    }
}
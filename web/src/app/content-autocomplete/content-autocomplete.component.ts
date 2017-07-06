import {Component, Output, EventEmitter, Input} from '@angular/core';
import {Content} from "../content/content";

import * as _ from 'lodash';

const DROPDOWN_ITEM_CLASS = 'dropdown-item';

@Component({
    selector: 'content-autocomplete',
    templateUrl: 'content-autocomplete.component.html',
    styleUrls: ['content-autocomplete.component.sass']
})
export class ContentAutocompleteComponent {

    @Input('value') selectedValue: any;
    @Input('content') set model(content: Array<Content>) {
        this.content = content;
        this.data = [...content];
    }

    @Output() select = new EventEmitter<Content>();
    @Output() add = new EventEmitter();

    content: Array<Content>;
    data: Array<Content>;
    filter: string;
    isShowDropdown = false;

    getValue(): string {
        return this.selectedValue ? this.selectedValue : '';
    }

    handleKeyUp(event: any) {
        this.filter = event.target.value;
        if (!this.filter) {
            this.emitEmptySelection();
            this.showAll();
            return;
        }
        this.performFiltering();
    }

    showAll() {
        this.data = [...this.content];
        this.showDropdown();
    }

    performFiltering() {
        let value = this.filter.toLowerCase();
        this.data = _.filter(this.content, c => c.short_name.toLowerCase().indexOf(value) !== -1);
    }

    onSelect(content: Content) {
        this.emitSelection(content);
        this.hideDropdown();
        this.selectedValue = content.short_name;
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

    handleTextSelection(event) {
        event.stopPropagation();
    }

    emitEmptySelection() {
        this.emitSelection(new Content());
    }

    emitSelection(content: Content) {
        this.select.emit(content);
    }
}
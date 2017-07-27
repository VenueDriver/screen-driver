import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

const DROPDOWN_ITEM_CLASS = 'dropdown-item';

@Component({
    selector: 'autocomplete',
    templateUrl: 'autocomplete.component.html',
    styleUrls: ['autocomplete.component.sass']
})
export class AutocompleteComponent implements OnInit {

    @Input() items: Array<string>;
    @Input() value: string;
    @Input() placeholder = '';

    @Output() select = new EventEmitter<string>();

    isShowDropdown = false;

    constructor() { }

    ngOnInit() { }

    getValue(): string {
        return this.value ? this.value : '';
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

    handleKeyUp(event: any) {
        this.showDropdown();
    }

    onSelect(item: string) {
        this.emitSelection(item);
        this.hideDropdown();
        this.value = item;
    }

    emitSelection(item: string) {
        this.select.emit(item);
    }

}
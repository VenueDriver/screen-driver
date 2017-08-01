import {Component, Input, Output, EventEmitter} from '@angular/core';

const DROPDOWN_ITEM_CLASS = 'dropdown-item';

@Component({
    selector: 'autocomplete',
    templateUrl: 'autocomplete.component.html',
    styleUrls: ['autocomplete.component.sass']
})
export class AutocompleteComponent {

    @Input() items: Array<string>;
    @Input() value: string;
    @Input() placeholder = '';
    @Input() readonly = false;
    @Input() disabled = false;

    @Output() valueChanged = new EventEmitter<string>();

    isShowDropdown = false;

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
        this.value = item;
        this.emitSelection();
        this.hideDropdown();
    }

    emitSelection() {
        this.valueChanged.emit(this.value);
    }

}
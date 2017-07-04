import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'content-autocomplete',
    templateUrl: 'content-autocomplete.component.html',
    styleUrls: ['content-autocomplete.component.sass']
})
export class ContentAutocompleteComponent implements OnInit {

    public placeholder: string = 'Type "it" for suggestions';
    public listItems: Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
    public popupSettings = {animate: false};

    constructor() { }

    ngOnInit() { }

}
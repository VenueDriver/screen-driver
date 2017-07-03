import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {VenuesService} from "../venues.service";

import * as _ from 'lodash';

@Component({
    selector: 'edit-venue-form',
    templateUrl: 'edit-venue-form.component.html'
})
export class EditVenueFormComponent implements OnInit {

    @Input() venues: Array<any>;
    @Input() content: Array<any>;
    @Input('currentNode') set currentNode(currentNode: any) {
        this.node = currentNode;
        this.nodeData = currentNode.data;
        this.isFormValid = !!this.nodeData.name;
    };

    @Output() submit = new EventEmitter();
    @Output() cancel = new EventEmitter();

    node: any;
    nodeData: any;
    isFormValid;
    contentUrlPlaceholder = 'Default URL';

    constructor(private venueService: VenuesService) { }

    ngOnInit() { }

    isInputInvalid(): boolean {
        return this.isCurrentNodeHasName() && !this.isFormValid;
    }

    isCurrentNodeHasName(): boolean {
        return !_.isEmpty(this.nodeData.name)
    }

    getValidationMessage(): string {
        let item = this.getNodeLevelName(this.node);
        return this.venueService.getValidationMessage(item);
    }

    getNameInputPlaceholder(): string {
        return `${this.getNodeLevelName(this.node)} name`;
    }

    private getNodeLevelName(node: any) {
        switch (node.level) {
            case 3: return 'Screen';
            case 2: return 'Screen group';
            default: return 'Venue';
        }
    }

    validateForm() {
        let siblings = this.node.parent.data.children;
        this.nodeData.name = this.nodeData.name.trim();
        this.isFormValid = this.isCurrentNodeHasName() && !this.hasSiblingWithTheSameName(siblings);
    }

    hasSiblingWithTheSameName(siblings): boolean {
        return !!_.find(siblings, s => {
            return s.id !== this.nodeData.id &&
                s.name === this.nodeData.name;
        });
    }

    getDropdownValue(): string {
        return this.nodeData.content ? this.nodeData.content.short_name : this.contentUrlPlaceholder;
    }

    setNodeContent(content) {
        if (!_.isEmpty(content.id)) {
            this.nodeData.content = content;
            this.nodeData.content_id = content.id;
        } else {
            this.nodeData.content = null;
            this.nodeData.content_id = null;
        }
    }

    performCancel(event: any) {
        this.stopClickPropagation(event);
        this.cancel.emit(this.node);
    }

    performSubmit(event: any) {
        this.stopClickPropagation(event);
        this.submit.emit(this.node);
    }

    stopClickPropagation(event: any) {
        event.stopPropagation();
    }

}
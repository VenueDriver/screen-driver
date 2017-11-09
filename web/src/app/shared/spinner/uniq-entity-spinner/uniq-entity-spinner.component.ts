import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {UniqEntity} from "./uniq-entity.interface";
import {SpinnerName} from "./spinner-name";

@Component({
    selector: 'uniq-entity-spinner',
    template: `<spinner [name]="this.uniqName"></spinner>`
})
export class UniqEntitySpinnerComponent implements OnInit {
    @Input() prefix: string = '';
    @Input() entity: UniqEntity;

    private uniqName: string = '';

    ngOnInit(): void {
        this.uniqName = SpinnerName.getName(this.entity, this.prefix)
    }
}

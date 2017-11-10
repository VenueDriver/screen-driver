import {Component, Input, OnInit} from '@angular/core';
import {UniqEntity} from './uniq-entity.interface';
import {SpinnerName} from './spinner-name';
import {SpinnerService} from '../spinner.service';

@Component({
    selector: 'uniq-entity-spinner',
    template: `<spinner [name]='this.uniqName'></spinner>`
})
export class UniqEntitySpinnerComponent implements OnInit {
    @Input() prefix: string = '';
    @Input() entity: UniqEntity;

    uniqName: string = '';

    constructor(private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        this.uniqName = SpinnerName.getName(this.entity, this.prefix)
    }

    get enabled(): boolean {
      return this.spinnerService.isShown(this.uniqName);
    }
}

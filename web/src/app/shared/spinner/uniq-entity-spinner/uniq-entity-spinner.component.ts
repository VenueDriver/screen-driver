import {Component, Input, OnInit} from '@angular/core';
import {UniqEntity} from './uniq-entity.interface';
import {SpinnerNameUtils} from './spinner-name-utils';
import {SpinnerService} from '../spinner.service';

@Component({
    selector: 'uniq-entity-spinner',
    templateUrl: './uniq-entity-spinner.component.html',
    styleUrls: ['./uniq-entity-spinner.component.scss']
})
export class UniqEntitySpinnerComponent implements OnInit {
    @Input() prefix: string = '';
    @Input() entity: UniqEntity;

    @Input() message?: string;

    uniqName: string = '';

    constructor(private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        this.uniqName = SpinnerNameUtils.getName(this.entity, this.prefix)
    }

    get enabled(): boolean {
      return this.spinnerService.isShown(this.uniqName);
    }
}

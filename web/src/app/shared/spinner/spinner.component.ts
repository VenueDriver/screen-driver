import { SpinnerService } from './spinner.service';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";

@Component({
    selector: 'spinner',
    template: `
        <div *ngIf="isShowing">
            <div class="loader"></div>
        </div>`,
    styleUrls: [ 'spinner.component.scss' ]
})
export class SpinnerComponent implements OnInit, OnDestroy {
    @Input() name: string;

    @Input()
    get show(): boolean {
        return this.isShowing;
    }

    set show(val: boolean) {
        this.isShowing = val;
        this.showChange.emit(this.isShowing);
    }

    @Output() showChange = new EventEmitter();

    private isShowing = false;

    constructor(private spinnerService: SpinnerService) { }

    ngOnInit(): void {
        if (!this.name) throw new Error("Spinner must have a 'name' attribute.");

        this.spinnerService._register(this);
    }

    ngOnDestroy(): void {
        this.spinnerService._unregister(this);
    }
}

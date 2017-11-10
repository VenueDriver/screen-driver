import {SpinnerComponent} from './spinner.component';
import {Injectable} from '@angular/core';

import * as _ from "lodash";

@Injectable()
export class SpinnerService {
    private spinnerCache = new Set<SpinnerComponent>();

    _register(spinner: SpinnerComponent): void {
        this.spinnerCache.add(spinner);
    }

    _unregister(spinnerToRemove: SpinnerComponent): void {
        let spinnerName = spinnerToRemove.name;
        let spinner = this.findSpinnerByName(spinnerName);

        if (spinner) this.spinnerCache.delete(spinner);
    }

    isShown(spinnerName: string): boolean {
        let spinner = this.findSpinnerByName(spinnerName);

        return spinner ? spinner.show : false;
    }

    show(spinnerName: string): void {
        let spinner = this.findSpinnerByName(spinnerName);
        if (spinner) spinner.show = true;
    }

    hide(spinnerName: string): void {
        let spinner = this.findSpinnerByName(spinnerName);
        if (spinner) spinner.show = false;
    }

    private findSpinnerByName(spinnerName: string): SpinnerComponent {
        return _.find(Array.from(this.spinnerCache), (s: SpinnerComponent) => s.name == spinnerName);
    }
}

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
        let spinner = _.find(Array.from(this.spinnerCache), (s: SpinnerComponent) => s === spinnerToRemove);
        if (spinner) this.spinnerCache.delete(spinner);
    }

    isShown(spinnerName: string): boolean {
        let spinner = Array.from(this.spinnerCache).filter((s: SpinnerComponent) => s.name == spinnerName)[0];

        return spinner ? spinner.show : false;
    }

    show(spinnerName: string): void {
        let spinner = _.find(Array.from(this.spinnerCache), (s: SpinnerComponent) => s.name == spinnerName);
        if (spinner) spinner.show = true;
    }

    hide(spinnerName: string): void {
        let spinner = _.find(Array.from(this.spinnerCache), (s: SpinnerComponent) => s.name == spinnerName);
        if (spinner) spinner.show = false;
    }
}

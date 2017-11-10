import {SpinnerComponent} from './spinner.component';
import {Injectable} from '@angular/core';

@Injectable()
export class SpinnerService {
    private spinnerCache = new Set<SpinnerComponent>();

    _register(spinner: SpinnerComponent): void {
        this.spinnerCache.add(spinner);
    }

    _unregister(spinnerToRemove: SpinnerComponent): void {
        this.spinnerCache.forEach(spinner => {
            if (spinner === spinnerToRemove) {
                this.spinnerCache.delete(spinner);
            }
        });
    }

    isShown(spinnerName: string): boolean {
        let spinner = Array.from(this.spinnerCache).filter((s: SpinnerComponent) => s.name == spinnerName)[0];

        return spinner ? spinner.show : false;
    }

    show(spinnerName: string): void {
        this.spinnerCache.forEach(spinner => {
            if (spinner.name === spinnerName) {
                spinner.show = true;
            }
        });
    }

    hide(spinnerName: string): void {
        this.spinnerCache.forEach(spinner => {
            if (spinner.name === spinnerName) {
                spinner.show = false;
            }
        });
    }
}

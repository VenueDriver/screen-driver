import {SpinnerComponent} from "./spinner.component";
import {Injectable} from "@angular/core";

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
        this.spinnerCache.forEach(spinner => {
            if (spinner.name === spinnerName) {
                return spinner.show;
            }
        });

        return false;
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

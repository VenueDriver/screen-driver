import {Directive, HostBinding, Input, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {DataLoadingMonitorService} from "../../services/data-loading-monitor/data-loading-monitor.service";

@Directive({
    selector: '[waitForLoading]'
})
export class WaitForLoadingDirective implements OnInit {

    constructor(private sanitizer: DomSanitizer,
                private dataLoadingMonitorService: DataLoadingMonitorService) {
    }

    ngOnInit() {
        this.dataLoadingMonitorService.requestsPerformingStateObservable
            .subscribe(isRequestPerforming => {
                let blur = this.sanitizer.bypassSecurityTrustStyle("blur(1px)");
                this.safeBlur = isRequestPerforming ? blur : 'none';
            })
    }

    @HostBinding('style.filter')
    safeBlur;

}

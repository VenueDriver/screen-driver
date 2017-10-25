import {Component, Input} from "@angular/core";
import {KioskVersion} from "../../entities/kiosk-version";

@Component({
    selector: 'kiosk-version-details',
    templateUrl: 'kiosk-version-details.component.html',
    styleUrls: ['kiosk-version-details.component.sass']
})
export class KioskVersionDetailsComponent {

    @Input() versionDetails: KioskVersion;
}
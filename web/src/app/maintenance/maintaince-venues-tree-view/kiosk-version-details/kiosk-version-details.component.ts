import {Component, Input} from "@angular/core";
import {KioskVersion} from "../../entities/kiosk-version";
import {format} from 'date-fns'

@Component({
    selector: 'kiosk-version-details',
    templateUrl: 'kiosk-version-details.component.html',
    styleUrls: ['kiosk-version-details.component.sass']
})
export class KioskVersionDetailsComponent {

    @Input('versionDetails') set _versionDetails(versionDetails: KioskVersion) {
        this.versionDetails.version = versionDetails && versionDetails.version ? versionDetails.version : 'N/A';
        this.versionDetails.updatedAt = versionDetails ? versionDetails.updatedAt : undefined;
    }

    versionDetails: KioskVersion = new KioskVersion();

}
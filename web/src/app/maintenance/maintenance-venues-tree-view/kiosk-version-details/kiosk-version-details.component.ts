import {Component, Input} from "@angular/core";
import {KioskVersionDetails} from "../../entities/kiosk-version-details";

@Component({
    selector: 'kiosk-version-details',
    templateUrl: 'kiosk-version-details.component.html',
    styleUrls: ['kiosk-version-details.component.sass']
})
export class KioskVersionDetailsComponent {

    @Input('versionDetails') set _versionDetails(versionDetails: KioskVersionDetails) {
        this.versionDetails.version = versionDetails && versionDetails.version ? versionDetails.version : 'N/A';
        this.versionDetails.updatedAt = versionDetails ? versionDetails.updatedAt : undefined;
    }

    versionDetails: KioskVersionDetails = new KioskVersionDetails();

}

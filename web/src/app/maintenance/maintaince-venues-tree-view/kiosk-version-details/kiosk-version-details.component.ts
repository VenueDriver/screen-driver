import {Component, Input} from "@angular/core";
import {KioskVersion} from "../../entities/kiosk-version";
import {format} from 'date-fns'

@Component({
    selector: 'kiosk-version-details',
    templateUrl: 'kiosk-version-details.component.html',
    styleUrls: ['kiosk-version-details.component.sass']
})
export class KioskVersionDetailsComponent {

    @Input() versionDetails: KioskVersion;

    formatDate(date) {
        if (isNaN(Date.parse(date))) {
            return "";
        }
        return format(date, 'MMMM D, YYYY [at] hh:mm A');
    }
}
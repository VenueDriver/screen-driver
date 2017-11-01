import {KioskVersionDetails} from "../../entities/kiosk-version-details";
import * as _ from 'lodash';

export class KioskVersionServiceFixture {

    static kioskVersions(count: number): Array<KioskVersionDetails> {
        return _.range(count).map((index) => {
            const kioskVersion = new KioskVersionDetails();
            kioskVersion.screenId = index;
            kioskVersion.version = index;

            return kioskVersion;
        });
    }
}

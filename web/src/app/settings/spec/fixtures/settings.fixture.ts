import * as _ from 'lodash';
import {Setting} from "../../entities/setting";

export class SettingsFixture {

    static getSettings(count: number): Array<Setting> {
        return _.range(count).map(index => {
            const setting = new Setting();
            setting.id = index;
            return setting;
        });
    }

    static getSetting(settingId?: string): Setting {
        let setting = new Setting();
        if (settingId) setting.id = settingId;
        setting.name = 'setting';
        setting.enabled = true;
        return setting;
    }
}

import {Setting} from "../../../../settings/entities/setting";

export class SettingsFixture {

    static getSettingWithId(): Setting {
        let setting = new Setting();
        setting.id = 'settingId';
        return setting;
    }

}

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Setting} from "../entities/setting";

@Component({
    selector: 'settings-group',
    templateUrl: './settings-group.component.html',
    styleUrls: ['./settings-group.component.sass']
})
export class SettingsGroupComponent {
    @Input() priorityType;
    @Input() settings: Array<Setting>;
    @Input() activeSetting: Setting;
    @Output() settingUpdate = new EventEmitter();
    @Output() settingSelect = new EventEmitter();

    constructor() {
    }

    isActive(setting: Setting): boolean {
        return this.activeSetting && this.activeSetting.id === setting.id;
    }

    handleSettingUpdate() {
        this.settingUpdate.emit();
    }

    onSettingSelection(setting: Setting) {
        this.settingSelect.emit(setting);
    }

}

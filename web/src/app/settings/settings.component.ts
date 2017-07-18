import {Component, OnInit} from '@angular/core';
import {Setting} from "./entities/setting";
import {SettingStateHolderService} from "./setting-state-manager/settings-state-holder.service";

@Component({
    selector: 'settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.sass']
})
export class SettingsComponent implements OnInit {

    configs: Setting[];
    currentConfig: Setting;

    constructor(private configStateHolderService: SettingStateHolderService) {
    }

    ngOnInit() {
        this.configStateHolderService.reloadConfigs();
        this.configStateHolderService.getAllConfigs().subscribe(configs => this.configs = configs);
        this.configStateHolderService.getCurrentConfig().subscribe(config => this.currentConfig = config);
    }

    configSelected(config: Setting) {
        this.configStateHolderService.changeCurrentConfig(config);
    }

}

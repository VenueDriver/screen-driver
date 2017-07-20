import {Component, OnInit, Input} from '@angular/core';
import {Setting} from "../entities/setting";
import {SettingStateHolderService} from "../setting-state-manager/settings-state-holder.service";

@Component({
    selector: 'priority-type-tag',
    templateUrl: 'priority-type-tag.component.html',
    styleUrls: ['priority-type-tag.component.sass']
})
export class PriorityTypeTagComponent implements OnInit {

    @Input() setting: Setting;
    priorityTypes: any[];
    currentPriority;

    constructor(private settingStateHolderService: SettingStateHolderService) {
    }

    ngOnInit() {
        this.priorityTypes = this.settingStateHolderService.getPriorityTypes();
        this.currentPriority = this.priorityTypes.find(type => this.setting.priority === type.id)
    }

    getPriorityName(): string {
        return this.currentPriority.name;
    }

    getPriorityStyle() {
        let stylePrefix = 'priority-';
        let styleIndex = this.priorityTypes.indexOf(this.currentPriority);
        return stylePrefix + styleIndex;
    }

}

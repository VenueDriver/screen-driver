import {Component, Input} from '@angular/core';
import {Setting} from "../entities/setting";
import {SettingStateHolderService} from "../setting-state-manager/settings-state-holder.service";

@Component({
    selector: 'priority-type-tag',
    templateUrl: 'priority-type-tag.component.html',
    styleUrls: ['priority-type-tag.component.sass']
})
export class PriorityTypeTagComponent {

    @Input('priority') set data(priority: any) {
        this.priorityTypes = this.settingStateHolderService.getPriorityTypes();
        this.currentPriority = this.priorityTypes.find(type => priority.id === type.id);
    }

    priorityTypes: any[];
    currentPriority;

    constructor(private settingStateHolderService: SettingStateHolderService) {
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

export class Setting {
    id: string;
    name: string;
    enabled = false;
    priority: Object;
    config: any = {};
    forciblyEnabled: boolean = false;
    _rev: number;
}

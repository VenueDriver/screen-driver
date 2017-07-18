export class Setting {
    id: string;
    name: string;
    enabled = false;
    priority: Object;
    config: any = {};
    _rev: number;
}
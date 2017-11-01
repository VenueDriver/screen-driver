import {Content} from "../../../content/content";
import {ScreenGroup} from "./screen-group";

export class Venue {
    id: string;
    name: string;
    content: Content;
    screen_groups: ScreenGroup[];
    _rev: number;
}

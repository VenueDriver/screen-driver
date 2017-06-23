import {Content} from "../../content/content";
import {ScreenGroup} from "./screen-group";

export class Venue {
    id: string;
    name: string;
    content: Content;
    screen_groups: ScreenGroup[];
    content_id: string;
    _rev: number;
}

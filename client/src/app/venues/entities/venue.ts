import {Content} from "../../content/content";
import {ScreenGroup} from "./screen-group";

export class Venue {
    id: string;
    name: string;
    content: Content;
    screenGroups: ScreenGroup[];
    _rev: number;
}

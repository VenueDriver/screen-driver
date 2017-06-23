import {Content} from "../../content/content";
import {Screen} from "./screen";

export class ScreenGroup {
    id: string;
    name: string;
    content: Content;
    content_id: string;
    screens: Screen[];
}

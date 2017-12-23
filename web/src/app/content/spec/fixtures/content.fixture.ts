import * as _ from 'lodash';
import {Content} from "../../content";

export class ContentFixture {

    static getContentList(count: number): Array<Content> {
        return _.range(count).map((index) => ContentFixture.getContent(index));
    }

    static getContent(id?: string): Content {
        let content = new Content();
        content.id = id;
        content.short_name = 'content';
        content.url = 'http://content.com';
        return content;
    }
}

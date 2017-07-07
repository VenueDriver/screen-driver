import * as _ from 'lodash';

export class Content {

    static readonly MIN_FIELD_LENGTH = 4;

    id: string = '';
    short_name: string = '';
    url: string = '';

    constructor(content?: Content) {
        if (content) {
            this.id = content.id;
            this.short_name = content.short_name;
            this.url = content.url;
        }
    }

    //TODO implement url validation
    static validate(content: Content): boolean {
        return Content.isShortNameValid(content) &&
               Content.isUrlValid(content)
    }

    static isUrlValid(content: Content): boolean {
        return !_.isEmpty(content.url) &&
               content.url.trim().length >= Content.MIN_FIELD_LENGTH;
    }

    static isShortNameValid(content: Content): boolean {
        return !_.isEmpty(content.short_name) &&
               content.short_name.trim().length >= Content.MIN_FIELD_LENGTH;
    }
}

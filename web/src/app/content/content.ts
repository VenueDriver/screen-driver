import * as _ from 'lodash';

const URL_VALIDATION_PATTERN = /[\w\.-]*\.[a-z]{2,3}[\w.,@?^=%&amp;:/~+#\{\}\[\]-]*$/;

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

    static validate(content: Content): boolean {
        return Content.isShortNameValid(content) &&
               Content.isUrlValid(content)
    }

    static isUrlValid(content: Content): boolean {
        return !_.isEmpty(content.url) &&
               URL_VALIDATION_PATTERN.test(content.url);
    }

    static isShortNameValid(content: Content): boolean {
        return !_.isEmpty(content.short_name) &&
               content.short_name.trim().length >= Content.MIN_FIELD_LENGTH;
    }

    static getShortUrl(content: Content, maxLength: number): string {
        if (_.isEmpty(content.url)) {
            return '';
        }
        let urlLength = content.url.length;
        if (urlLength > maxLength + 5) {
            let start = content.url.substring(0, maxLength - 5);
            let end = content.url.substring(urlLength - 5, urlLength);
            return `${start}...${end}`;
        }
        return content.url;
    }
}

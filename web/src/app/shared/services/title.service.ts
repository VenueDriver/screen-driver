import {Injectable} from "@angular/core";

import { ɵgetDOM as getDOM } from '@angular/platform-browser';

const DEFAULT_TITLE_SUFFIX = '| ScreenDriver';

@Injectable()
export class TitleService {


    getTitle(doc: Document): string {
        return getDOM().getTitle(doc);
    }

    setTitle(doc: Document, newTitle: string) {
        let title = `${newTitle} ${DEFAULT_TITLE_SUFFIX}`;
        getDOM().setTitle(doc, title);
    }
}

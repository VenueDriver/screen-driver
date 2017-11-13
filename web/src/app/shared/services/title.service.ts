import {Injectable} from "@angular/core";

import { ɵgetDOM as getDOM } from '@angular/platform-browser';

@Injectable()
export class TitleService {

    getTitle(doc: Document): string {
        return getDOM().getTitle(doc);
    }

    setTitle(doc: Document, newTitle: string) {
        getDOM().setTitle(doc, newTitle);
    }
}

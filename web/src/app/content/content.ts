import * as _ from 'lodash';

export class Content {
  id: String = '';
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
  validate() {
    return !_.isEmpty(this.short_name)
        && this.short_name.trim().length > 3
        && !_.isEmpty(this.url)
        && this.url.trim().length > 3;
  }
}

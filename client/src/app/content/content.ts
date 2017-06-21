export class Content {
  constructor(content?: Content) {
    if (content) {
      this.id = content.id;
      this.short_name = content.short_name;
      this.url = content.url;
    }
  }
  id: String = '';
  short_name: String = '';
  url: String = '';
}

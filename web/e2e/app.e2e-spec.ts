import { ScreenDriverPage } from './app.po';

describe('screen-driver App', () => {
  let page: ScreenDriverPage;

  beforeEach(() => {
    page = new ScreenDriverPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

import { IasCliPage } from './app.po';

describe('ias-cli App', () => {
  let page: IasCliPage;

  beforeEach(() => {
    page = new IasCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

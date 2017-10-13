import { LogisticsTemplatePage } from './app.po';

describe('logistics-template App', () => {
  let page: LogisticsTemplatePage;

  beforeEach(() => {
    page = new LogisticsTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

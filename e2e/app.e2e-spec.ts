import { MyFirstAngularProjectPage } from './app.po';

describe('my-first-angular-project App', () => {
  let page: MyFirstAngularProjectPage;

  beforeEach(() => {
    page = new MyFirstAngularProjectPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

import {Locator, Page} from "@playwright/test";

export class LoginPagePo {
    private page: Page;

    private get inputLogin(): Locator {
        return this.page.locator(`#loginform-username`);
    }
    private get inputPass(): Locator{
        return this.page.locator("#loginform-password");
    }
    private get loginButton(): Locator{
        return this.page.locator("[name='login-button']");
    };
    constructor(page: Page) {
        this.page = page;
    };
    public async login(): Promise<void> {
        await this.page.goto('https://enotes.pointschool.ru/login');
        await this.inputLogin.pressSequentially('test', {delay: 100});
        await this.inputPass.pressSequentially('test', {delay: 100});
        await this.loginButton.click();
    };
}



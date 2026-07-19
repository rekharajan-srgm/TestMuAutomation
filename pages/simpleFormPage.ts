import { PlaywrightWrapper } from "../helpers/PlaywrightWrapper";
import { Page } from "@playwright/test";
export class SimpleFormPage extends PlaywrightWrapper {

    constructor(page: Page) {
        super(page);
    }

    homepageUrl: string = "https://www.testmuai.com/selenium-playground";
    async getCheckedValue() {
        await this.goto(this.homepageUrl);
        // await this.page.locator("//a[text()='Simple Form Demo']").click();
        const link = this.page.getByRole('link', { name: 'Simple Form Demo' });
        await link.scrollIntoViewIfNeeded();
        await link.click();
        await this.page.waitForURL(/simple-form-demo/);
        const urlFind = this.page.url();
        let message = "Welcome to TestMu AI";
        await this.page.getByPlaceholder('Please enter your Message').fill(message);
        // this.page.getByRole('textbox',{name:'Enter Message'}).fill(message);
        // await this.page.getByRole('button',{name:'Get Checked Value'}).click();
        const button = this.page.locator('#showInput');
        await button.scrollIntoViewIfNeeded();
        await button.click()
        const labelMessage = await this.page.locator("//label[text()='Your Message: ']").textContent();
        await this.page.locator('#message').waitFor({ state: 'visible' });
        // const messageFind = await this.page.locator("//p[@id='message']").textContent();
        const messageFind = await this.page.locator("#message").textContent();
        console.log("messageFind: ", messageFind);
        return { urlFind, messageFind, labelMessage };
    }

}
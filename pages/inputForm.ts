import { PlaywrightWrapper } from "../helpers/PlaywrightWrapper";
import { Page } from "@playwright/test";
export class InputFormPage extends PlaywrightWrapper {

    constructor(page: Page) {
        super(page);
    }

    homepageUrl: string = "https://www.testmuai.com/selenium-playground";
    async noSubmitForm() {
        await this.goto(this.homepageUrl);
        const link = this.page.getByRole('link', { name: 'Input Form Submit' });
        await link.scrollIntoViewIfNeeded();
        await link.click({timeout:10000});
        await this.page.waitForURL(/input-form-demo/);
        await this.page.getByRole('button',{name:'Submit'}).click({timeout:10000});
        const message = await this.page.locator("#name").evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        return message;
        // return this.page.locator("#name");  
    }
    
    async submitForm() {
        await this.goto(this.homepageUrl);
        const link = this.page.getByRole('link', { name: 'Input Form Submit' });
        await link.scrollIntoViewIfNeeded();
        await link.click();
        await this.page.waitForURL(/input-form-demo/);
        await this.page.locator('//label[text()="Name*"]//following-sibling::input').fill('Queen Roy');
        await this.page.locator('//label[text()="Email*"]//following-sibling::input').fill('queenroy@gmail.com');
        await this.page.locator('//label[text()="Password*"]//following-sibling::input').fill('Indian@2026');
        await this.page.locator('//label[text()="Company*"]//following-sibling::input').fill('CTS');
        await this.page.locator('//label[text()="Website*"]//following-sibling::input').fill('www.cts.com');
        await this.page.selectOption('//label[text()="Country*"]//following-sibling::select',{label:'United States'});
        await this.page.locator('//label[text()="City*"]//following-sibling::input').fill('los angeles');
        await this.page.locator('//label[text()="Address*"]//following-sibling::input').first().fill('Electronic City');
        await this.page.locator('//label[text()="Address*"]//following-sibling::input').last().fill('near aura tower');
        await this.page.locator('//label[text()="State*"]//following-sibling::input').last().fill('california');
        await this.page.locator('//label[text()="Zip Code*"]//following-sibling::input').last().fill('560100');
        await this.page.getByRole('button',{name:'Submit'}).click();
        const thanksMsg=await this.page.locator("//p[text()='Thanks for contacting us, we will get back to you shortly.']").isVisible();
        return thanksMsg;

        
    }

}
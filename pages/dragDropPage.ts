import { PlaywrightWrapper } from "../helpers/PlaywrightWrapper";
import { Page } from "@playwright/test";
export class DragDropPage extends PlaywrightWrapper {

    constructor(page: Page) {
        super(page);
    }

    homepageUrl: string = "https://www.testmuai.com/selenium-playground";
    async dragBar() {
        await this.goto(this.homepageUrl);
        const link = this.page.getByRole('link', { name: 'Drag & Drop Sliders' });
        await link.scrollIntoViewIfNeeded();
        await link.click();
        await this.page.waitForURL(/drag-drop-range-sliders-demo/);
        const isVisible = await this.page.locator("//h4[text()=' Default value 15']").isVisible();
        if (isVisible) {
            console.log("Element is visible*******");
        } else {
            console.log("Element is not visible*******");
        }
        // await this.page.locator("(//input[@type='range'])[3]").focus();
        // for (let i = 15; i < 95; i++) {
        //     await this.page.keyboard.press("ArrowRight");
        // }
        const slider = this.page.locator("(//input[@type='range'])[3]");
        await slider.focus();

        // Set slider value to 95 directly in the browser instead of pressing
        // ArrowRight 80 times — avoids LambdaTest session timeout over slow network
        await slider.evaluate((el: HTMLInputElement) => {
            el.value = '95';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        await this.page.locator('#rangeSuccess').waitFor({ state: 'visible' });
        const outValue = await this.page.locator("//output[@id='rangeSuccess']").textContent();
        return outValue;
    }

}
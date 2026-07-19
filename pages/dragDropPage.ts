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
        await slider.waitFor({ state: 'visible' });

        const box = await slider.boundingBox();
        if (!box) throw new Error('Slider bounding box not found');

        // Slider range is 0–100, current default value is 15, target is 95
        const startX = box.x + (box.width * 15 / 100);
        const endX   = box.x + (box.width * 95 / 100);
        const y      = box.y + box.height / 2;

        await this.page.mouse.move(startX, y);
        await this.page.mouse.down();
        await this.page.mouse.move(endX, y, { steps: 20 });
        await this.page.mouse.up();
        await this.page.locator('#rangeSuccess').waitFor({ state: 'visible' });
        const outValue = await this.page.locator("//output[@id='rangeSuccess']").textContent();
        return outValue;
    }

}
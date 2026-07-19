import {Page} from '@playwright/test';
export class PlaywrightWrapper {
    page:Page;
    constructor(page:Page){
        this.page=page;
    }
    async goto(url:string){
        await this.page.goto(url,{waitUntil:'domcontentloaded'});
    }
}
import { test, expect } from '../fixtures/testmu';
import { SimpleFormPage } from '../pages/simpleFormPage';
test.describe('simple form test', () => {
    test('should fill out the form', async ({ page }) => {
        const simpleFormPage = new SimpleFormPage(page);
        const checkValueFinds=await simpleFormPage.getCheckedValue()
        expect(checkValueFinds.urlFind).toContain('simple-form-demo');
        expect(checkValueFinds.labelMessage).toContain('Your Message');
        expect(checkValueFinds.messageFind).toBe('Welcome to TestMu AI');
        
    });
});
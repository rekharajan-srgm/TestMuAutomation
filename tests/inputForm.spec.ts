import { test, expect } from '../fixtures/testmu';
import { InputFormPage } from '../pages/inputForm';
test.describe('input form test', () => {
    test('testing the input form submission without filling the form', async ({ page }) => {
        const inputFormPage = new InputFormPage(page);
        const checkValueFinds=await inputFormPage.noSubmitForm();
        // expect(checkValueFinds).toHaveAttribute("required", "");
        await expect(checkValueFinds).toBe("Please fill out this field.");
    });

    test('testing the input form submission with filling the form', async ({ page }) => {
        const inputFormPage = new InputFormPage(page);
        const submitValue=await inputFormPage.submitForm();
        await expect(submitValue).toBe(true);
    });
});
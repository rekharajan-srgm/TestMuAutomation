import { test, expect } from '../fixtures/testmu';
import { DragDropPage } from '../pages/dragDropPage';
test.describe('drag and drop test', () => {
    test('testing the drag functionality', async ({ page }) => {
        const dragDropPage = new DragDropPage(page);
        const checkValueFinds=await dragDropPage.dragBar()
        await expect(checkValueFinds).toBe('95');
    });
});
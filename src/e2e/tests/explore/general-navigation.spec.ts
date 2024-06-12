import { test, expect } from '@playwright/test';
import { ExplorerPage } from '/home/Valentina/Proyectos/code example/src/e2e/pages/explorer-page.ts';

test.describe('E-commerce basic navigation', () => {
    let explorerPage: ExplorerPage;

    test.beforeEach(async ({ page }) => {
        explorerPage = new ExplorerPage(page);
        await page.goto('/');
    });

    test('should display warning message if items are out of stock', async () => {
        const hasWarning = await explorerPage.hasWarningMessage();
        expect(hasWarning).toBe(true);

        const warningMessageCorrect = await explorerPage.areWarningMessagesEqual(explorerPage.expectedWarningMessageForOutOfStockItems);
        expect(warningMessageCorrect).toBe(true);
    });

    test('should navigate to category and back', async () => {
        await explorerPage.selectCategory('Creams');
        const categoryName = await explorerPage.getCategoryName('Creams');
        expect(categoryName).toBe('Creams');

        await explorerPage.goBack();
        const productListVisible = await explorerPage.productList.isVisible();
        expect(productListVisible).toBe(true);
    });

    test('should view product details and go back', async () => {
        await explorerPage.selectProduct('Brushes');
        const productNameCorrect = await explorerPage.areProductNamesEqual('Brushes');
        expect(productNameCorrect).toBe(true);

        await explorerPage.viewMoreDetails();
        const productDetailsVisible = await explorerPage.productInstance.isVisible();
        expect(productDetailsVisible).toBe(true);

        await explorerPage.goBack();
        const productListVisible = await explorerPage.productList.isVisible();
        expect(productListVisible).toBe(true);
    });

    test('should filter by category', async () => {
        await explorerPage.filterByCategory('Make Up Products');
        const categoryName = await explorerPage.getCategoryName('Make Up Products');
        expect(categoryName).toBe('Make Up Products');
    });

    test('should filter by product', async () => {
        await explorerPage.filterByProduct('Hands Cream');
        const productNameCorrect = await explorerPage.areProductNamesEqual('Hands Cream');
        expect(productNameCorrect).toBe(true);
    });

    test('should clear category filter', async () => {
        await explorerPage.clearCategoryFilter();
        const categoryFilterCleared = await explorerPage.searchInputs.nth(0).inputValue();
        expect(categoryFilterCleared).toBe('');
    });

    test('should clear product filter', async () => {
        await explorerPage.clearProductFilter();
        const productFilterCleared = await explorerPage.searchInputs.nth(1).inputValue();
        expect(productFilterCleared).toBe('');
    });
});

import { Locator, Page } from "@playwright/test";

export class MaterialPage {
    readonly page: Page;

    readonly dialog: Locator;
    readonly overlayContainer: Locator;
    readonly itemsPerPageSelect: Locator;
    readonly selectedItemsCount: Locator;
    readonly tableLoadingContainer: Locator;

    constructor(page: Page) {
        this.page = page;

        this.dialog = page.getByRole("dialog");
        this.overlayContainer = page.locator(".overlay-container");
        this.itemsPerPageSelect = page.locator(
            'select[aria-label="Items per page"]'
        );
        this.selectedItemsCount = page.locator(".selected-items-count");
        this.tableLoadingContainer = page.locator(".table-loading-container");
    }

    /**
     * Opens a select popup.
     *
     * @param selector - Selector for the select element.
     * @returns A promise that resolves when the popup is open.
     */
    async openSelectPopup(selector: string): Promise<void> {
        await this.page.waitForSelector(`${selector}[aria-disabled=false]`);
        await this.attemptToOpenSelectPopup(selector);
    }

    /**
     * Selects an option from a select popup.
     *
     * @param selector - Selector for the select element.
     * @param value - The value of the option to select.
     * @returns A promise that resolves when the option is selected.
     */
    async selectOption(selector: string, value: string | number): Promise<void> {
        await this.openSelectPopup(selector);
        await this.overlayContainer.locator(`option:text-is("${value}")`).click();
    }

    /**
     * Attempts to open a select popup.
     *
     * @param selector - Selector for the select element.
     * @returns A promise that resolves when the popup is open.
     */
    private async attemptToOpenSelectPopup(selector: string): Promise<void> {
        await this.page.locator(selector).click();
        if ((await this.overlayContainer.locator("option").count()) === 0) {
            await this.page.waitForTimeout(100);
            await this.attemptToOpenSelectPopup(selector);
        }
    }

    /**
     * Changes the number of items displayed per page.
     *
     * @param pageSize - The number of items per page.
     * @returns A promise that resolves when the page size is changed.
     */
    async changePageSize(pageSize: 10 | 20 | 30): Promise<void> {
        await this.selectOption(
            'mat-select[aria-label="Items per page"]',
            pageSize
        );
        await this.waitForTableLoad();
    }

    /**
     * Gets the current number of items displayed per page.
     *
     * @returns A promise that resolves to the current page size.
     */
    async getPageSize(): Promise<number> {
        const pageSizeText = await this.itemsPerPageSelect.innerText();
        return Number(pageSizeText);
    }

    /**
     * Gets the count of selected items.
     *
     * @returns A promise that resolves to the count of selected items.
     */
    async getSelectedItemsCount(): Promise<number> {
        if (await this.selectedItemsCount.isHidden()) {
            return 0;
        }
        const selectedItemsCountText = await this.selectedItemsCount.innerText();
        return Number(selectedItemsCountText.split(" ")[0]);
    }

    /**
     * Navigates to the specified page number.
     *
     * @param pageNumber - The page number to navigate to.
     * @returns A promise that resolves when the navigation is complete.
     */
    async gotoPage(pageNumber: number): Promise<void> {
        await this.page
            .locator(`button:has-text("Go to page ${pageNumber}")`)
            .click();
        await this.waitForTableLoad();
    }

    /**
     * Waits for the table to finish loading.
     *
     * @returns A promise that resolves when the table has finished loading.
     */
    async waitForTableLoad(): Promise<void> {
        await this.page.waitForTimeout(250);
        await this.tableLoadingContainer.locator(":not(.loading)").waitFor();
    }
}

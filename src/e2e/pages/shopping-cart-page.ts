import { Locator, Page } from '@playwright/test';
import { expect } from '@e2e/fixtures';

export class ShoppingCartPage {
    readonly page: Page;

    readonly productCategorySelector: Locator;
    readonly productSelector: Locator;
    readonly cartModal: Locator;
    readonly addToCartButton: Locator;
    readonly closeButton: Locator;
    readonly cancelButton: Locator;
    readonly proceedToCheckoutButton: Locator;
    readonly editCartButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productCategorySelector = page.getByTestId('category-selector');
        this.productSelector = page.getByTestId('product-selector');
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
        this.cartModal = page.locator('#cart-modal');
        this.closeButton = page.getByRole('button', { name: 'Close' }).first();
        this.cancelButton = page.getByTestId('cancel-button');
        this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });
        this.editCartButton = page.getByTestId('edit-cart-button');
    }

    async goToProductPage(): Promise<void> {
        await this.page.goto('ecommerce/products');
    }

    /**
     * Tries to open the cart modal
     * @return void
     */
    async openCartModal(): Promise<void> {
        expect(await this.addToCartButton.isVisible());
        await this.addToCartButton.click();
    }

    /**
     * Confirms that the cart modal is visible
     * @return boolean
     */
    async isCartModalVisible(): Promise<boolean> {
        return await this.cartModal.isVisible();
    }

    /**
     * Tries to add a product to the cart
     * @param productId - The ID of the product to add to the cart
     * @return void
     */
    async addProductToCart(productId: string): Promise<void> {
        await this.productSelector.click();
        await this.page.getByRole('option', { name: `${productId}` }).click();
        await this.addToCartButton.click();
    }

    /**
     * Tries to click the proceed to checkout button after adding products to the cart
     * @return void
     */
    async proceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
    }

    /**
     * Tries to check if the proceed to checkout button is disabled
     * @return boolean
     */
    async isProceedToCheckoutButtonDisabled(): Promise<boolean> {
        return await this.proceedToCheckoutButton.isDisabled();
    }

    /**
     * Tries to close the cart modal from the cancel button
     * @return void
     */
    async closeCartModalFromCancelButton(): Promise<void> {
        await this.cancelButton.click();
    }

    /**
     * Tries to close the cart modal from the close button
     * @return void
     */
    async closeCartModalFromCloseButton(): Promise<void> {
        await this.closeButton.click();
    }

    /**
     * Finds a product in the cart
     * Searches through the items in the cart
     * @param {string} productId - The ID of the product
     * @return {Promise<Locator>} - Returns the locator of the item found
     */

    async findProductInCart(productId: string): Promise<Locator | null> {
        await this.page.waitForSelector('.cart-item', { state: 'visible' });

        const itemLocators = await this.page.locator('.cart-item').all();
        let foundItem: Locator | null = null;
        let i = 0;

        while (i < itemLocators.length && !foundItem) {
            const itemLocator = itemLocators[i];
            const itemText = await itemLocator.innerText();

            if (itemText.includes(productId)) {
                foundItem = itemLocator;
            }

            i++;
        }

        return foundItem;
    }
    /**
     * Clicks the edit button in the specified cart item
     * It receives a locator of the item and attempts to click the edit button within that item
     * If the edit button is enabled, it is clicked
     * @param {Locator} itemLocator - The locator of the item containing the edit button
     * @return {Promise<void>}
     */
    async clickEditCartItemButton(itemLocator: Locator): Promise<void> {
        const editButton = itemLocator.locator(this.editCartButton);
        await editButton.click();
    }
}

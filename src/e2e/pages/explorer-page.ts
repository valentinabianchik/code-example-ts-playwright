import { Locator, Page } from "@playwright/test";

export class ExplorerPage {
  readonly page: Page;

  readonly banner: Locator;
  readonly message: Locator;
  readonly moreDetailsBtn: Locator;
  readonly productInstance: Locator;
  readonly productName: Locator;
  readonly backBtn: Locator;
  readonly searchInputs: Locator;
  readonly productList: Locator;
  readonly categoryList: Locator;

  readonly expectedWarningMessageForOutOfStockItems =
    "Some items in your cart are out of stock. Please review your cart." as const;

  constructor(page: Page) {
    this.page = page;

    this.banner = page.locator(".notification-banner");
    this.message = page.locator(".notification-banner p");
    this.moreDetailsBtn = page.locator('[aria-label="View more details"]');
    this.productInstance = page.locator(".product-details__instance");
    this.productName = page.locator(".product-details__name");
    this.backBtn = page.locator('a[aria-label="Go back"]');
    this.searchInputs = page.locator(".search-text input");
    this.productList = page.locator(".product-list");
    this.categoryList = page.locator(".category-list");
  }

  async hasWarningMessage(): Promise<boolean> {
    return (await this.banner.count()) === 1;
  }

  async areWarningMessagesEqual(warningMessage: string): Promise<boolean> {
    return warningMessage == (await this.message.innerText());
  }

  async areProductNamesEqual(name: string): Promise<boolean> {
    return (await this.productName.innerText()).includes(name);
  }

  async areProductInstancesEqual(instanceName: string): Promise<boolean> {
    return (await this.productInstance.innerText()).includes(instanceName);
  }

  /**
   * Tries to display the product details.
   *
   */
  async viewMoreDetails(): Promise<void> {
    await this.moreDetailsBtn.click();
  }

  /**
   * Tries to navigate back to the product list.
   *
   */
  async goBack(): Promise<void> {
    await this.backBtn.click();
  }

  /**
   * Tries to navigate to the category given as parameter in the e-commerce.
   */
  async selectCategory(category: string): Promise<void> {
    await this.categoryList
      .first()
      .getByText(category, { exact: true })
      .click();
  }

  /**
   * Tries to navigate to the category given as parameter in the e-commerce and then returns its name.
   * @param category the visible name of the category
   */
  async getCategoryName(category: string): Promise<string> {
    const categoryElement = this.categoryList
      .first()
      .getByText(category, { exact: true });
    const categoryName = await categoryElement.innerText();
    return categoryName;
  }

  /**
   * Tries to navigate to the product given as parameter in the e-commerce.
   * @param productName name of the product to be displayed
   */
  async selectProduct(productName: string): Promise<void> {
    await this.productList
      .nth(1)
      .getByText(productName, { exact: true })
      .click();
  }

  /**
   * Tries to navigate deeper into the product details.
   * @param itemName name of the product to be displayed
   * @param number position in which it appears on the page
   */
  async goForwardInTheProductDetails(
    itemName: string,
    number?: number
  ): Promise<void> {
    await this.page
      .getByRole("row", { name: `${itemName} ►` })
      .nth(number || 0)
      .getByRole("button", { name: "►" })
      .click();
  }

  /**
   * Tries to filter by a category in the e-commerce.
   * @param category name of the category to be displayed
   */
  async filterByCategory(category: string): Promise<void> {
    await this.searchInputs.nth(0).fill(category);
  }

  /**
   * Tries to filter by a product in the e-commerce.
   * @param productName name of the product to be displayed
   */
  async filterByProduct(productName: string): Promise<void> {
    await this.searchInputs.nth(1).fill(productName);
  }

  /**
   * Tries to clean the Category Filter
   */
  async clearCategoryFilter(): Promise<void> {
    await this.searchInputs.nth(0).fill("");
  }

  /**
   * Tries to clean the Product Filter
   */
  async clearProductFilter(): Promise<void> {
    await this.searchInputs.nth(1).fill("");
  }
}

import { test as base } from '@playwright/test';
import { AccessPage } from './access-page';
import { MaterialPage } from './material-page';
import { ExplorerPage } from './explorer-page';
import { ShoppingCartPage } from './shopping-cart-page';

type Fixtures = {
  accessPage: AccessPage;
  materialPage: MaterialPage;
  explorerPage: ExplorerPage;
  shoppingCartPage: ShoppingCartPage;
};

export const test = base.extend<Fixtures>({
  accessPage: async ({ page }, use) => await use(new AccessPage(page)),
  materialPage: async ({ page }, use) => await use(new MaterialPage(page)),
  explorerPage: async ({ page }, use) => await use(new ExplorerPage(page)),
  shoppingCartPage: async ({ page }, use) => await use(new ShoppingCartPage(page)),
});

export { expect } from '@playwright/test';

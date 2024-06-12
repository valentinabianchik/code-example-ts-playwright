import { LoginOptions } from "@e2e/models/acces.ts";
import { Locator, Page } from "@playwright/test";
import { execSync } from "node:child_process";

export class AccessPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly logInBtn: Locator;

  readonly expectedWarningMessageForBlokedUSER =
    "Account locked: too many login attempts. Please try again later." as const;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel("username");
    this.passwordInput = page.getByLabel("password");
    this.logInBtn = page.getByRole("button", { name: "logIn" });
  }

  async login({ username, password }: { username: string; password: string; }): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await Promise.all([
      this.page.waitForURL('https://www.esteelauder.com/'), 
      this.logInBtn.click(),
    ]);
  }

  /**
   * Tries to force the blocking of a user.
   *
   * @param username invalid usarName
   * @param password invalid password
   */
  async forceBlock({ username, password }: LoginOptions): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    for (let index = 0; index < 10; index++) {
      await this.logInBtn.click();
    }

    await this.logInBtn.click();

    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Tries unblock IP user.
   */
  async unblockIP(): Promise<void> {
    const command = `docker exec -i deployment-hub-1 python manage.py defender_unblock_user --ip ${process.env.USER_IP}`;
    execSync(command);
  }
}

import { Response, Page, Locator } from '@playwright/test';
import { MaterialPage } from './material-page';

export class ProjectCredentialsPage {
    readonly materialPage: MaterialPage;
    readonly page: Page;

    readonly addCredentialButton: Locator;
    readonly tokenTextarea: Locator;
    readonly addButton: Locator;

    constructor(page: Page) {
        this.materialPage = new MaterialPage(page);
        this.page = page;
        this.addCredentialButton = page.locator('button:has-text("Add Credential")');
        this.tokenTextarea = this.materialPage.dialog.locator('textarea:below(:text("Token"))');
        this.addButton = this.materialPage.dialog.locator('button:has-text("Add")');
    }

    async gotoProjectCredentialList(): Promise<Response> {
        // BASE_URL is required in order to use it in the global setup.
        return this.page.goto(
            `${process.env.BASE_URL}/console/project-credentials`
        );
    }

    async registerCredential(accessCredential: string): Promise<void> {
        await this.addCredentialButton.click();
        await this.tokenTextarea.fill(accessCredential);
        await Promise.all([
            this.page.waitForResponse(
                (response) =>
                    response.url() ===
                    `${process.env.API_URL}/admin/project-credentials/` &&
                    response.request().method() === 'POST'
            ),
            this.addButton.click(),
        ]);
    }
}

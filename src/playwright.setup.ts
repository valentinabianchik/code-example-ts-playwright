import { AccessPage } from '@e2e/pages/access-page';
import { ProjectCredentialsPage } from '/home/Valentina/Proyectos/code example/src/e2e/pages/project-credentials-page.ts';
import { Browser, chromium } from '@playwright/test';

interface UserConfig {
  username: string;
  password: string;
  accessCredential: string;
  storageState: string;
}

async function globalSetup(): Promise<void> {
  const browser = await chromium.launch();
  const accounts = [
    {
      username: process.env.MAIN_USER_USERNAME,
      password: process.env.MAIN_USER_PASSWORD,
    },
    {
      username: process.env.ANOTHER_USER_USERNAME,
      password: process.env.ANOTHER_USER_PASSWORD,
    },
  ];
  for (const account of accounts) {
    await generateAndSaveUserState(browser, account);
  }

  await browser.close();
}

async function generateAndSaveUserState(
  browser: Browser,
  { username, password, accessCredential, storageState }: UserConfig
) {
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL);
  const accessPage = new AccessPage(page);
  await accessPage.login({ username, password });
  const projectCredentialsPage = new ProjectCredentialsPage(page);
  if (accessCredential) {
    await projectCredentialsPage.gotoProjectCredentialList();
    await projectCredentialsPage.registerCredential(accessCredential);
  }
  await page.close();
}

export default globalSetup;

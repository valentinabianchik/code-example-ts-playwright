import { Locator } from '@playwright/test';
import crypto from 'node:crypto';

export function generateUniqueText(length: number): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
   * Awaits for an element to be loaded
   * @param element 
   * @returns {boolean}
   */
export async function waitForElementToBeVisible(element: Locator): Promise<void> {
  await element.waitFor({ state: 'visible' });
}

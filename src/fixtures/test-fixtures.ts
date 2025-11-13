/**
 * Custom Playwright Test Fixtures
 * Extends Playwright test with API and UI helpers
 */

import { test as base, APIRequestContext } from '@playwright/test';
import { ApiHelper } from '../helpers/ApiHelper';
import { UiHelper } from '../helpers/UiHelper';
import { testContext } from '../core/TestContext';

type CustomFixtures = {
  apiHelper: ApiHelper;
  uiHelper: UiHelper;
  testContext: typeof testContext;
};

/**
 * Extended test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
  // API Helper fixture
  apiHelper: async ({}, use) => {
    const apiHelper = new ApiHelper();
    await use(apiHelper);
    await apiHelper.dispose();
  },

  // UI Helper fixture
  uiHelper: async ({ page }, use) => {
    const uiHelper = new UiHelper(page);
    await use(uiHelper);
  },

  // Test Context fixture
  testContext: async ({}, use) => {
    testContext.clear(); // Clear context before each test
    await use(testContext);
    testContext.printContext(); // Print context after test
  },
});

export { expect } from '@playwright/test';

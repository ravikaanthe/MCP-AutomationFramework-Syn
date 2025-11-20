/**
 * Custom Playwright Test Fixtures
 * Extends Playwright test with API and UI helpers
 * Supports optional self-healing capabilities
 */

import { test as base, APIRequestContext } from '@playwright/test';
import { ApiHelper } from '../helpers/ApiHelper';
import { UiHelper } from '../helpers/UiHelper';
import { SelfHealingHelper } from '../helpers/SelfHealingHelper';
import { testContext } from '../core/TestContext';

type CustomFixtures = {
  apiHelper: ApiHelper;
  uiHelper: UiHelper;                      // Standard UI Helper (no self-healing)
  uiHelperWithSelfHealing: UiHelper;       // UI Helper with self-healing enabled
  selfHealingHelper: SelfHealingHelper;    // Self-healing logic helper
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

  // UI Helper fixture (Standard - No Self-Healing)
  uiHelper: async ({ page }, use) => {
    const uiHelper = new UiHelper(page);
    await use(uiHelper);
  },

  // Self-Healing Helper fixture
  selfHealingHelper: async ({ page }, use) => {
    const selfHealingHelper = new SelfHealingHelper(page);
    await use(selfHealingHelper);
    // Print healing summary after test
    selfHealingHelper.printHealingSummary();
  },

  // UI Helper WITH Self-Healing
  uiHelperWithSelfHealing: async ({ page, selfHealingHelper }, use) => {
    const uiHelper = new UiHelper(page, selfHealingHelper);
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

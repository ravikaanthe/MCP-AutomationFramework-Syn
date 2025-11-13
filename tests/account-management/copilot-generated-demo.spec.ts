/**
 * Parabank End-to-End API to UI Account Creation Validation
 * Generated from: prompts/AccountManagement/create-account-api-to-ui-e2e.prompt
 * Framework: Playwright MCP + GitHub Copilot
 * 
 * This test validates that a new account created through API 
 * is displayed in the Parabank web UI.
 */

import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Parabank End-to-End - API to UI Account Creation Validation', () => {
  
  test('Create account via API and verify in UI', async ({ page, apiHelper, testContext }) => {
    
    console.log('\n' + '='.repeat(70));
    console.log('🎯 Parabank End-to-End API to UI Account Creation Validation');
    console.log('='.repeat(70) + '\n');

    // Step 1: Login via API
    console.log('📍 Step 1: Login via API');
    await apiHelper.init('https://parabank.parasoft.com');
    
    const loginResponse = await apiHelper.get('/parabank/services/bank/login/ficusroot/katalon');
    expect(loginResponse.status).toBe(200);
    
    // Extract customer ID directly from JSON response
    const customerId = loginResponse.body.id;
    testContext.set('customerId', customerId);
    console.log(`   ✅ Logged in successfully. Customer ID: ${customerId}\n`);

    // Step 2: Retrieve Existing Accounts via API
    console.log('📍 Step 2: Retrieve Existing Accounts via API');
    const accountsResponse = await apiHelper.get(`/parabank/services/bank/customers/${customerId}/accounts`);
    expect(accountsResponse.status).toBe(200);
    
    // Extract first account ID from JSON array
    const firstAccountId = Array.isArray(accountsResponse.body) ? accountsResponse.body[0].id : accountsResponse.body.id;
    testContext.set('firstAccountId', firstAccountId);
    console.log(`   ✅ Retrieved accounts. First Account ID: ${firstAccountId}\n`);

    // Step 3: Create New Account via API
    console.log('📍 Step 3: Create New Account via API');
    const createAccountResponse = await apiHelper.post(
      `/parabank/services/bank/createAccount?customerId=${customerId}&newAccountType=1&fromAccountId=${firstAccountId}`
    );
    expect(createAccountResponse.status).toBe(200);
    
    // Extract new account ID from JSON response
    const newAccountId = createAccountResponse.body.id;
    testContext.set('newAccountId', newAccountId);
    console.log(`   ✅ New account created. Account ID: ${newAccountId}\n`);

    // Step 4: Launch Web Application
    console.log('📍 Step 4: Launch Web Application');
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await page.waitForLoadState('networkidle');
    console.log(`   ✅ Web application loaded\n`);

    // Step 5: Login to Web UI
    console.log('📍 Step 5: Login to Web UI');
    await page.fill('input[name="username"]', 'ficusroot');
    await page.fill('input[name="password"]', 'katalon');
    await page.click('input[type="submit"][value="Log In"]');
    await page.waitForLoadState('networkidle');
    console.log(`   ✅ Logged in to web UI\n`);

    // Step 6: Verify Successful Login
    console.log('📍 Step 6: Verify Successful Login');
    const accountOverviewLink = page.locator('a:has-text("Accounts Overview")');
    await expect(accountOverviewLink).toBeVisible();
    console.log(`   ✅ Login successful - Account Overview link is visible\n`);

    // Step 7: Validate New Account in UI
    console.log('📍 Step 7: Validate New Account in UI');
    await accountOverviewLink.click();
    await page.waitForLoadState('networkidle');
    
    // Check if the new account ID is displayed in the account list table
    const accountLink = page.locator(`a:has-text("${newAccountId}")`);
    await expect(accountLink).toBeVisible({ timeout: 10000 });
    console.log(`   ✅ New account verified in UI - Account ID ${newAccountId} is displayed\n`);

    // Final validation
    console.log('='.repeat(70));
    console.log('✅ TEST PASSED: Account created via API is visible in UI');
    console.log('='.repeat(70) + '\n');

    // Print test context
    console.log('📊 Test Execution Summary:');
    testContext.printContext();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'passed') {
      console.log('\n✅ Test Status: PASSED');
    } else {
      console.log('\n❌ Test Status: FAILED');
      console.log('   Error:', testInfo.error?.message || 'Unknown error');
    }
  });
});

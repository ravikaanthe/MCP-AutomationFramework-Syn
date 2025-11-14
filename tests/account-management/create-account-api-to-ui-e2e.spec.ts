/**
 * Parabank End-to-End API to UI Account Creation Validation
 * Generated from: prompts/AccountManagement/create-account-api-to-ui-e2e.prompt
 * Framework Guidelines: prompts/FRAMEWORK-GUIDELINES.md
 * Generated on: November 13, 2025
 */

import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Parabank Account Creation - API to UI E2E', () => {
  
  test('Create account via API and validate in UI', async ({ apiHelper, uiHelper, testContext }) => {
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 Parabank End-to-End API to UI Account Creation Validation');
    console.log('='.repeat(80) + '\n');
    
    // ================================================================
    // Step 1: Login via API
    // ================================================================
    console.log('📍 Step 1: Login via API');
    await apiHelper.init('https://parabank.parasoft.com');
    
    const loginResponse = await apiHelper.get('/parabank/services/bank/login/ficusroot/katalon');
    expect(loginResponse.status).toBe(200);
    
    const customerId = loginResponse.body.id;
    testContext.set('customerId', customerId);
    console.log(`   ✅ Login successful - Customer ID: ${customerId}\n`);
    
    // ================================================================
    // Step 2: Retrieve Existing Accounts via API
    // ================================================================
    console.log('📍 Step 2: Retrieve Existing Accounts via API');
    const accountsResponse = await apiHelper.get(`/parabank/services/bank/customers/${customerId}/accounts`);
    expect(accountsResponse.status).toBe(200);
    
    const firstAccountId = Array.isArray(accountsResponse.body) 
      ? accountsResponse.body[0].id 
      : accountsResponse.body.id;
    testContext.set('firstAccountId', firstAccountId);
    console.log(`   ✅ Retrieved accounts - First Account ID: ${firstAccountId}\n`);
    
    // ================================================================
    // Step 3: Create New Account via API
    // ================================================================
    console.log('📍 Step 3: Create New Account via API');
    const createResponse = await apiHelper.post(
      `/parabank/services/bank/createAccount?customerId=${customerId}&newAccountType=1&fromAccountId=${firstAccountId}`
    );
    expect(createResponse.status).toBe(200);
    
    const newAccountId = createResponse.body.id;
    testContext.set('newAccountId', newAccountId);
    console.log(`   ✅ New account created - Account ID: ${newAccountId}\n`);
    
    // ================================================================
    // Step 4: Launch Web Application
    // ================================================================
    console.log('📍 Step 4: Launch Web Application');
    await uiHelper.navigateTo('https://parabank.parasoft.com/parabank/index.htm');
    console.log('   ✅ Web application loaded\n');
    
    // ================================================================
    // Step 5: Login to Web UI
    // ================================================================
    console.log('📍 Step 5: Login to Web UI');
    await uiHelper.fill('input[name="username"]', 'ficusroot');
    await uiHelper.fill('input[name="password"]', 'katalon');
    await uiHelper.click('input[type="submit"]');
    console.log('   ✅ Login credentials submitted\n');
    
    // ================================================================
    // Step 6: Verify Successful Login
    // ================================================================
    console.log('📍 Step 6: Verify Successful Login');
    await uiHelper.waitForElement('a[href*="overview"]', 15000);
    const isOverviewVisible = await uiHelper.isVisible('a[href*="overview"]');
    expect(isOverviewVisible).toBe(true);
    console.log('   ✅ Account Overview link is visible - Login successful\n');
    
    // ================================================================
    // Step 7: Validate New Account in UI
    // ================================================================
    console.log('📍 Step 7: Validate New Account in UI');
    await uiHelper.clickLink('Accounts Overview');
    
    // Wait for page to load
    const page = uiHelper.getPage();
    await page.waitForLoadState('networkidle');
    
    // Verify account appears in the list
    const accountLink = page.locator(`a:has-text("${newAccountId}")`);
    await expect(accountLink).toBeVisible({ timeout: 15000 });
    console.log(`   ✅ New account ${newAccountId} found in Account Overview\n`);
    
    // Take screenshot
    await uiHelper.takeScreenshot(`account-creation-e2e-${newAccountId}`);
    
    // ================================================================
    // Test Summary
    // ================================================================
    console.log('='.repeat(80));
    console.log('✅ TEST PASSED - E2E Validation Complete');
    console.log('='.repeat(80));
    console.log('\n📊 Test Context:');
    console.log(`   • Customer ID: ${testContext.get('customerId')}`);
    console.log(`   • First Account ID: ${testContext.get('firstAccountId')}`);
    console.log(`   • New Account ID: ${testContext.get('newAccountId')}`);
    console.log('');
  });
});

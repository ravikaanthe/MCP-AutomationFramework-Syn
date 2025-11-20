/**
 * Auto-generated from: prompts/AccountManagement/create-account-api-to-ui-e2e SelfHealing.prompt
 * Title: Parabank Account Creation with Self-Healing
 * Self-Healing: ENABLED
 */

import { test } from '../../src/fixtures/test-fixtures';

test.describe('Parabank Account Creation with Self-Healing', () => {
  test('Create account via API and verify in UI with self-healing', async ({ 
    page, 
    apiHelper, 
    uiHelperWithSelfHealing,
    testContext 
  }) => {
    
    // Step 1: Login via API
    console.log('\n=== Step 1: Login via API ===');
    await apiHelper.init('https://parabank.parasoft.com');
    const loginResponse = await apiHelper.get('/parabank/services/bank/login/ficusroot/katalon');
    
    const customerId = Array.isArray(loginResponse.body) 
      ? loginResponse.body[0].id 
      : loginResponse.body.id;
    
    console.log(`✓ Customer ID: ${customerId}`);
    testContext.set('customerId', customerId);
    
    // Step 2: Retrieve Existing Accounts via API
    console.log('\n=== Step 2: Retrieve Existing Accounts ===');
    const accountsResponse = await apiHelper.get(`/parabank/services/bank/customers/${customerId}/accounts`);
    
    const firstAccountId = Array.isArray(accountsResponse.body) 
      ? accountsResponse.body[0].id 
      : accountsResponse.body.id;
    
    console.log(`✓ First Account ID: ${firstAccountId}`);
    testContext.set('firstAccountId', firstAccountId);
    
    // Step 3: Create New Account via API
    console.log('\n=== Step 3: Create New Account via API ===');
    const createResponse = await apiHelper.post(
      `/parabank/services/bank/createAccount?customerId=${customerId}&newAccountType=1&fromAccountId=${firstAccountId}`
    );
    
    const newAccountId = createResponse.body.id || createResponse.body.accountId;
    console.log(`✓ New Account Created: ${newAccountId}`);
    testContext.set('newAccountId', newAccountId);
    
    // Step 4: Launch Web Application
    console.log('\n=== Step 4: Launch Web Application ===');
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await page.waitForLoadState('networkidle');
    console.log('✓ Application loaded');
    
    // Step 5: Login to Web UI (with self-healing)
    console.log('\n=== Step 5: Login to Web UI (Self-Healing Enabled) ===');
    await uiHelperWithSelfHealing.fill('input[name="username"]', 'FicusRoot');
    await uiHelperWithSelfHealing.fill('input[name="password"]', 'katalon');
    await uiHelperWithSelfHealing.click('input[type="submit"][value="Log In"]');
    
    await page.waitForLoadState('networkidle');
    console.log('✓ Logged in successfully');
    
    // Step 6: Verify Successful Login (with self-healing)
    console.log('\n=== Step 6: Verify Successful Login ===');
    await uiHelperWithSelfHealing.verifyElementVisible('a:has-text("Accounts Overview")');
    console.log('✓ Account Overview link visible');
    
    // Step 7: Validate New Account in UI (with self-healing)
    console.log('\n=== Step 7: Validate New Account in UI ===');
    await uiHelperWithSelfHealing.click('a:has-text("Accounts Overview")');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    console.log('✓ Navigated to Account Overview page');
    
    // Wait for account table
    await uiHelperWithSelfHealing.waitForElement('#accountTable', 15000);
    
    // Get all account rows
    const accountRows = await uiHelperWithSelfHealing.getTableRows('#accountTable tbody tr');
    console.log(`✓ Found ${accountRows.length} accounts in table`);
    
    // Check if new account ID is present
    let accountFound = false;
    for (let i = 0; i < accountRows.length; i++) {
      const accountIdLocator = `#accountTable tbody tr:nth-child(${i + 1}) td:first-child a`;
      const accountIdText = await uiHelperWithSelfHealing.getText(accountIdLocator);
      
      if (accountIdText === newAccountId) {
        accountFound = true;
        console.log(`✓ NEW ACCOUNT FOUND: ${newAccountId}`);
        break;
      }
    }
    
    // Validation
    if (accountFound) {
      console.log('\n✅ TEST PASSED: New account verified in UI');
    } else {
      throw new Error(`❌ TEST FAILED: Account ${newAccountId} not found in Account Overview`);
    }
  });
});

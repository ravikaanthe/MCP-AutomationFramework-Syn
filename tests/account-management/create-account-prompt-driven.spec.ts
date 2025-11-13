/**
 * Parabank Prompt-Driven Test - Account Creation
 * Module: AccountManagement
 * Executes test from natural language prompt file
 * 
 * This test demonstrates the prompt-driven testing approach
 */

import { test, expect } from '../../src/fixtures/test-fixtures';
import { PromptExecutor } from '../../src/core/PromptExecutor';
import * as path from 'path';

test.describe('Parabank Prompt-Driven E2E Test - Account Creation', () => {
  
  test('Execute create-account-api-to-ui-e2e prompt', async ({ page, apiHelper }) => {
    const promptPath = path.join(__dirname, '../../prompts/AccountManagement/create-account-api-to-ui-e2e.prompt');
    
    const executor = new PromptExecutor(apiHelper, page);
    await executor.loadPrompt(promptPath);
    await executor.execute();
    
    console.log('\n=== Prompt Execution Completed ===');
  });
});

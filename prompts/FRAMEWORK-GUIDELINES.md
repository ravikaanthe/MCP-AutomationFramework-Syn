# 🎯 Playwright MCP Framework - Code Generation Guidelines
**Reference this document when asking GitHub Copilot to generate test scripts**

---

## 📋 Quick Reference for Copilot

When generating Playwright test scripts from prompt files, follow these patterns:

### **1. Test Structure Template**
```typescript
import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Test Suite Name', () => {
  test('Test case description', async ({ apiHelper, uiHelper, testContext }) => {
    // Test implementation
  });
});
```

### **2. API Helper Usage**

**Initialize:**
```typescript
await apiHelper.init('https://parabank.parasoft.com');
```

**GET Request:**
```typescript
const response = await apiHelper.get('/parabank/services/bank/endpoint');
const data = response.body;        // ⚠️ IMPORTANT: Always use .body
const statusCode = response.status; // HTTP status
```

**POST Request:**
```typescript
const response = await apiHelper.post('/parabank/services/bank/endpoint');
const data = response.body;        // ⚠️ IMPORTANT: Always use .body
```

**⚠️ CRITICAL:** ApiHelper returns `{ status, body, response }` - **always access `response.body`** for actual data!

### **3. UI Helper Usage**

**Navigation:**
```typescript
await uiHelper.navigateTo('https://example.com');
```

**Form Interactions:**
```typescript
await uiHelper.fill('input[name="username"]', 'value');
await uiHelper.click('button[type="submit"]');
```

**Wait for Elements:**
```typescript
await uiHelper.waitForElement('selector', 15000);
```

**Element Verification (Recommended):**
```typescript
const page = uiHelper.getPage();
await page.waitForLoadState('networkidle');
const element = page.locator('a:has-text("Text")');
await expect(element).toBeVisible({ timeout: 15000 });
```

### **4. Test Context (Variable Storage)**
```typescript
// Store
testContext.set('variableName', value);

// Retrieve
const value = testContext.get('variableName');
```

---

### **5. Self-Healing (Optional)**

**How to Enable:**
Just add `# Self-Healing: YES` in the prompt file header. That's it!

**In Prompt File:**
```plaintext
# Title: My Test
# Self-Healing: YES  ← Add this line only
# Description: Test with dynamic selectors
```

**Copilot will automatically:**
- Use `uiHelperWithSelfHealing` instead of `uiHelper`
- Add self-healing to all UI operations
- No need to repeat it in every step!

**When to Use Self-Healing:**
- ✅ Dynamic/unstable selectors (auto-generated IDs)
- ✅ Third-party applications with changing UI
- ❌ Critical security tests
- ❌ Stable applications

**Standard UI Helper (Default):**
```typescript
test('Test', async ({ uiHelper }) => {
  await uiHelper.click('button#submitBtn');
});
```

**Self-Healing UI Helper (Auto-generated when prompt has Self-Healing: YES):**
```typescript
test('Test', async ({ uiHelperWithSelfHealing }) => {
  await uiHelperWithSelfHealing.click('button#submitBtn');
  // Automatically tries fallbacks if selector fails
});
```

---

## 🏦 Parabank API Endpoints

**Base URL:** `https://parabank.parasoft.com`  
**API Path:** `/parabank/services/bank/`

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/login/{username}/{password}` | GET | Login | `{ id, firstName, lastName, ... }` |
| `/customers/{customerId}` | GET | Get customer details | Customer object |
| `/customers/{customerId}/accounts` | GET | Get accounts | Array or single account object |
| `/createAccount?customerId={id}&newAccountType={type}&fromAccountId={id}` | POST | Create account | `{ id, type, balance, ... }` |

---

## ✅ Best Practices Checklist

When generating tests, ensure:
- [ ] Import from `'../../src/fixtures/test-fixtures'`
- [ ] Use fixtures: `{ apiHelper, uiHelper, testContext }`
- [ ] API responses use `.body`: `response.body.id`
- [ ] Full API paths: `/parabank/services/bank/...`
- [ ] Wait for load: `page.waitForLoadState('networkidle')`
- [ ] Timeouts on checks: `{ timeout: 15000 }`
- [ ] Console logging: `console.log('Step X: ...')`
- [ ] Test context for variables
- [ ] Handle arrays: `Array.isArray(response.body) ? response.body[0] : response.body`

---

## 📚 Reference Examples

See these working tests for patterns:
- `tests/account-management/copilot-generated-demo.spec.ts`
- `tests/account-management/api-to-ui-account-creation.spec.ts`

---

## 🎯 Copilot Prompt Template

**Copy and paste this when asking Copilot to generate tests:**

```
Read the prompt file at: prompts/[MODULE]/[prompt-name].prompt

Generate a Playwright test script following the framework guidelines in:
prompts/FRAMEWORK-GUIDELINES.md

Key requirements:
- Use fixtures: { apiHelper, uiHelper, testContext }
- API responses: access via response.body
- Reference working example: tests/account-management/copilot-generated-demo.spec.ts

Save as: tests/[module]/[descriptive-name].spec.ts
```

---

**Last Updated:** November 13, 2025

# 🔧 Self-Healing Test Automation Guide

**Complete guide to using self-healing capabilities in the Playwright MCP Framework**

---

## 📋 Table of Contents

1. [What is Self-Healing?](#what-is-self-healing)
2. [When to Use Self-Healing](#when-to-use-self-healing)
3. [How It Works](#how-it-works)
4. [Getting Started](#getting-started)
5. [Fallback Strategies](#fallback-strategies)
6. [Code Examples](#code-examples)
7. [Healing Logs](#healing-logs)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 What is Self-Healing?

**Self-healing** is an advanced test automation capability that automatically recovers from selector failures by trying alternative element location strategies.

### **The Problem:**
```typescript
// Traditional approach - test fails if selector changes
await page.click('button#submit-btn-12345'); // ❌ Fails if ID changes
```

### **The Solution:**
```typescript
// Self-healing approach - tries fallback strategies
await uiHelperWithSelfHealing.click('button#submit-btn-12345');
// ✅ If ID changes, tries:
//    - CSS variations
//    - Text-based selectors ("Submit")
//    - Role-based selectors (role=button)
//    - Partial attribute matching
```

---

## 🎯 When to Use Self-Healing

### **✅ Use Self-Healing When:**

1. **Dynamic IDs/Classes**
   - Application generates random IDs: `user-123456`
   - Class names change frequently

2. **Third-Party Applications**
   - You don't control the UI
   - Frequent updates without notice

3. **Development Environments**
   - UI under active development
   - Frequent DOM structure changes

4. **Legacy Applications**
   - Poor selector stability
   - No semantic HTML

5. **Rapid Prototyping**
   - Quick test creation
   - Selector refinement later

### **❌ DON'T Use Self-Healing When:**

1. **Security/Compliance Tests**
   - Need exact element targeting
   - Regulatory requirements

2. **Pixel-Perfect Validation**
   - Testing specific element positions
   - CSS/layout testing

3. **Performance Tests**
   - Self-healing adds overhead
   - Requires consistent execution path

4. **Stable Applications**
   - Selectors never change
   - Well-maintained HTML

---

## ⚙️ How It Works

### **Self-Healing Process:**

```
1. TRY PRIMARY SELECTOR
   └─> If found: Use it ✅
   └─> If not found: Go to step 2

2. FALLBACK STRATEGY 1: CSS Variations
   └─> Try: #id, [id="id"], [id*="id"]
   └─> If found: Use it ✅
   └─> If not found: Go to step 3

3. FALLBACK STRATEGY 2: Text-Based
   └─> Try: text=Submit, :has-text("Submit")
   └─> If found: Use it ✅
   └─> If not found: Go to step 4

4. FALLBACK STRATEGY 3: Role-Based
   └─> Try: role=button, role=link
   └─> If found: Use it ✅
   └─> If not found: Go to step 5

5. FALLBACK STRATEGY 4: Partial Attributes
   └─> Try: [type="submit"], [name*="btn"]
   └─> If found: Use it ✅
   └─> If not found: Go to step 6

6. FALLBACK STRATEGY 5: Parent-Child
   └─> Try: Simplified parent selectors
   └─> If found: Use it ✅
   └─> If not found: FAIL ❌
```

---

## 🚀 Getting Started

### **Step 1: Choose Your Approach**

**Option A: Enable in Test Code**
```typescript
import { test, expect } from '../../src/fixtures/test-fixtures';

test('My test with self-healing', async ({ uiHelperWithSelfHealing }) => {
  await uiHelperWithSelfHealing.click('button#submitBtn');
});
```

**Option B: Enable in Prompt File**
```plaintext
# prompt.txt
# Title: My Test
# Self-Healing: YES
# Description: Test with dynamic selectors

## SELF-HEALING CONFIGURATION
**Enable Self-Healing:** YES
**Reason:** Application uses dynamic IDs
```

### **Step 2: Use Self-Healing Helper**

All standard UiHelper methods work with self-healing:

```typescript
test('Full example', async ({ 
  uiHelperWithSelfHealing, 
  testContext 
}) => {
  // Navigate
  await uiHelperWithSelfHealing.navigateTo('https://example.com');
  
  // Fill form
  await uiHelperWithSelfHealing.fill('input#username', 'john_doe');
  await uiHelperWithSelfHealing.fill('input#password', 'password123');
  
  // Click button
  await uiHelperWithSelfHealing.click('button#loginBtn');
  
  // Verify
  const welcomeText = await uiHelperWithSelfHealing.getText('h1.welcome');
  expect(welcomeText).toContain('Welcome');
});
```

---

## 🔄 Fallback Strategies

### **Strategy 1: CSS Variations**

**Purpose:** Try different CSS selector formats

**Example:**
```typescript
// Original: button#submit-btn
// Tries:
- #submit-btn
- [id="submit-btn"]
- [id*="submit-btn"]
- button#submit-btn
- button[id*="submit"]
```

### **Strategy 2: Text-Based Selectors**

**Purpose:** Locate elements by their visible text

**Example:**
```typescript
// Original: button#submitBtn (failed)
// Tries:
- text="Submit"
- :has-text("Submit")
- button:has-text("Submit")
- a:has-text("Submit")
- [aria-label="Submit"]
- [title="Submit"]
```

### **Strategy 3: Role-Based Selectors**

**Purpose:** Use ARIA roles for semantic matching

**Example:**
```typescript
// Original: button#loginBtn (failed)
// Tries:
- role=button
- role=link (if description contains "link")
- role=textbox (if description contains "input")
- role=checkbox (if description contains "checkbox")
```

### **Strategy 4: Partial Attribute Matching**

**Purpose:** Match partial attribute values

**Example:**
```typescript
// Original: input[name="user-name-field-123"]
// Tries:
- [name*="user-name"]
- [name^="user-name"]
- [name$="field"]
- [type="text"]
```

### **Strategy 5: Parent-Child Relationships**

**Purpose:** Simplify complex selectors

**Example:**
```typescript
// Original: div.container > form > button.submit
// Tries:
- div.container button.submit
- button.submit
- form button
```

---

## 💻 Code Examples

### **Example 1: Simple Form with Self-Healing**

```typescript
import { test, expect } from '../../src/fixtures/test-fixtures';

test('Login with self-healing', async ({ uiHelperWithSelfHealing }) => {
  await uiHelperWithSelfHealing.navigateTo('https://parabank.parasoft.com');
  
  // Even if IDs change, test continues
  await uiHelperWithSelfHealing.fill('input[name="username"]', 'ficusroot');
  await uiHelperWithSelfHealing.fill('input[name="password"]', 'katalon');
  await uiHelperWithSelfHealing.click('input[type="submit"]');
  
  // Verify login
  const page = uiHelperWithSelfHealing.getPage();
  await expect(page.locator('a:has-text("Log Out")')).toBeVisible();
});
```

### **Example 2: Mixing Standard and Self-Healing**

```typescript
test('Hybrid approach', async ({ uiHelper, uiHelperWithSelfHealing }) => {
  // Use standard for stable elements
  await uiHelper.navigateTo('https://example.com');
  
  // Use self-healing for unstable elements
  await uiHelperWithSelfHealing.click('button#dynamic-submit-btn-xyz');
  
  // Back to standard for verification
  const page = uiHelper.getPage();
  await expect(page.locator('h1')).toHaveText('Success');
});
```

### **Example 3: API + Self-Healing UI**

```typescript
test('E2E with self-healing', async ({ 
  apiHelper, 
  uiHelperWithSelfHealing, 
  testContext 
}) => {
  // API: Create account
  await apiHelper.init('https://parabank.parasoft.com');
  const response = await apiHelper.post('/parabank/services/bank/createAccount?customerId=123&newAccountType=1&fromAccountId=456');
  const accountId = response.body.id;
  testContext.set('accountId', accountId);
  
  // UI: Verify with self-healing
  await uiHelperWithSelfHealing.navigateTo('https://parabank.parasoft.com');
  await uiHelperWithSelfHealing.click('a:has-text("Accounts Overview")');
  
  const page = uiHelperWithSelfHealing.getPage();
  await expect(page.locator(`a:has-text("${accountId}")`)).toBeVisible();
});
```

---

## 📊 Healing Logs

### **Automatic Logging**

Self-healing automatically logs every selector that was healed:

**Console Output:**
```
[Self-Healing] Attempting to locate: clickable element
[Self-Healing] Primary selector: button#submit-btn-12345
[Self-Healing] ✗ Primary selector failed: button#submit-btn-12345
[Self-Healing] Attempting fallback strategies...
[Self-Healing] Trying strategy 1/5...
[Self-Healing] ✗ Strategy 1 failed
[Self-Healing] Trying strategy 2/5...
[Self-Healing] Text-based selector worked: button:has-text("Submit")
[Self-Healing] ✓ Strategy 2 succeeded!
[Self-Healing] ✓ HEALED SELECTOR:
  Original: button#submit-btn-12345
  Healed:   button
  Time:     2025-11-19T10:30:45.123Z
```

### **Healing Summary**

At the end of each test, a summary is printed:

```
[Self-Healing] ========== HEALING SUMMARY ==========
[Self-Healing] Total healed selectors: 3

[Self-Healing] Healing #1:
  Original: button#submit-btn-12345
  Healed:   button
  Time:     2025-11-19T10:30:45.123Z

[Self-Healing] Healing #2:
  Original: input#email-field-xyz
  Healed:   .email-input
  Time:     2025-11-19T10:30:47.456Z

[Self-Healing] Healing #3:
  Original: a#logout-link-789
  Healed:   a
  Time:     2025-11-19T10:30:50.789Z
[Self-Healing] =====================================
```

### **Accessing Healing Log in Code**

```typescript
test('Check healing log', async ({ 
  uiHelperWithSelfHealing, 
  selfHealingHelper 
}) => {
  await uiHelperWithSelfHealing.click('button#unstableId');
  
  // Get healing log
  const healingLog = selfHealingHelper.getHealingLog();
  console.log(`Total healed: ${healingLog.length}`);
  
  healingLog.forEach(entry => {
    console.log(`${entry.original} → ${entry.healed}`);
  });
});
```

---

## ✅ Best Practices

### **1. Start with Standard, Add Self-Healing When Needed**
```typescript
// Start here
test('Test', async ({ uiHelper }) => { ... });

// If selectors break frequently, switch to:
test('Test', async ({ uiHelperWithSelfHealing }) => { ... });
```

### **2. Document Why Self-Healing is Enabled**
```typescript
test.describe('Login Tests (Self-Healing)', () => {
  // Reason: Application uses dynamic session-based IDs
  test('Login', async ({ uiHelperWithSelfHealing }) => { ... });
});
```

### **3. Review Healing Logs Regularly**
- Check what selectors are being healed
- Update test code with healed selectors
- Reduce self-healing overhead over time

### **4. Don't Over-Rely on Self-Healing**
```typescript
// ❌ Bad: Generic selector relies on self-healing
await uiHelperWithSelfHealing.click('button');

// ✅ Good: Specific selector with self-healing backup
await uiHelperWithSelfHealing.click('button#submitBtn');
```

### **5. Use Descriptive Selectors**
```typescript
// ❌ Less effective
await uiHelperWithSelfHealing.click('div > span > a');

// ✅ More effective (text helps fallback)
await uiHelperWithSelfHealing.click('a#logout-btn'); // Contains "logout" text
```

### **6. Combine with TestContext**
```typescript
test('Store healed selectors', async ({ 
  uiHelperWithSelfHealing, 
  testContext,
  selfHealingHelper 
}) => {
  await uiHelperWithSelfHealing.click('button#dynamicId');
  
  const log = selfHealingHelper.getHealingLog();
  if (log.length > 0) {
    testContext.set('healedSelector', log[0].healed);
  }
});
```

---

## 🔧 Troubleshooting

### **Issue 1: Self-Healing Not Working**

**Symptoms:**
- Test still fails with selector errors
- No healing logs printed

**Solutions:**
1. **Check fixture usage:**
   ```typescript
   // ❌ Wrong
   test('Test', async ({ uiHelper }) => { ... });
   
   // ✅ Correct
   test('Test', async ({ uiHelperWithSelfHealing }) => { ... });
   ```

2. **Verify element exists:**
   - Self-healing can't find elements that don't exist
   - Check if element is in DOM

3. **Check timeout:**
   - Self-healing adds ~5-10s overhead
   - Increase test timeout if needed

### **Issue 2: Wrong Element Selected**

**Symptoms:**
- Self-healing finds element but it's the wrong one
- Test clicks wrong button

**Solutions:**
1. **Use more specific selectors:**
   ```typescript
   // ❌ Too generic
   await uiHelperWithSelfHealing.click('button');
   
   // ✅ More specific
   await uiHelperWithSelfHealing.click('button#submitBtn');
   ```

2. **Add context to selector:**
   ```typescript
   // ✅ Better
   await uiHelperWithSelfHealing.click('form.login-form button[type="submit"]');
   ```

### **Issue 3: Performance Degradation**

**Symptoms:**
- Tests running slower
- Many healing attempts in logs

**Solutions:**
1. **Update selectors based on healing logs:**
   ```typescript
   // Original selector kept failing
   // Healing log showed it always heals to: button.submit-btn
   
   // Update test code:
   await uiHelperWithSelfHealing.click('button.submit-btn'); // Now works first try
   ```

2. **Mix standard and self-healing:**
   ```typescript
   test('Test', async ({ uiHelper, uiHelperWithSelfHealing }) => {
     // Use standard for stable elements
     await uiHelper.fill('input[name="username"]', 'user');
     
     // Use self-healing only for unstable elements
     await uiHelperWithSelfHealing.click('button#dynamicSubmitId');
   });
   ```

### **Issue 4: Self-Healing Logs Too Verbose**

**Symptoms:**
- Console flooded with healing logs

**Solutions:**
1. **Reduce console.log in SelfHealingHelper.ts**
2. **Filter logs in test runner configuration**

---

## 🎯 Quick Reference

### **Standard vs Self-Healing**

| Feature | Standard (`uiHelper`) | Self-Healing (`uiHelperWithSelfHealing`) |
|---------|----------------------|------------------------------------------|
| **Speed** | ⚡ Fast | 🐌 Slower (fallback overhead) |
| **Stability** | 🎯 Exact targeting | 🔧 Flexible recovery |
| **Use Case** | Stable selectors | Dynamic selectors |
| **Logging** | Minimal | Detailed healing logs |
| **Maintenance** | Update on failures | Self-recovers |

### **Fixtures Summary**

```typescript
// Standard (No self-healing)
test('Test', async ({ uiHelper }) => { ... });

// With self-healing
test('Test', async ({ uiHelperWithSelfHealing }) => { ... });

// Access self-healing helper directly
test('Test', async ({ selfHealingHelper }) => {
  const log = selfHealingHelper.getHealingLog();
});

// Mix both
test('Test', async ({ uiHelper, uiHelperWithSelfHealing }) => { ... });
```

---

## 📚 Related Documentation

- **FRAMEWORK-COMPLETE-GUIDE.md** - Complete framework overview
- **FRAMEWORK-GUIDELINES.md** - Code generation patterns
- **README.md** - Project setup and overview
- **ARCHITECTURE.md** - Framework architecture details

---

**Last Updated:** November 19, 2025

**Self-Healing Version:** 1.0.0

**Maintained By:** Automation Team

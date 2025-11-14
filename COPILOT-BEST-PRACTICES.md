# GitHub Copilot - Best Practices for Test Generation

## 🎯 Problem
When you ask Copilot to generate tests from prompts, it might generate incorrect code because it doesn't know your framework's internal structure.

## ✅ Solution: Reference Central Guidelines

### **✅ BEST Copilot Prompt (Concise & Effective)**
```
Read the prompt file at: prompts/AccountManagement/create-account-api-to-ui-e2e.prompt

Generate a Playwright test following the framework guidelines in:
prompts/FRAMEWORK-GUIDELINES.md

Reference this working example for patterns:
tests/account-management/copilot-generated-demo.spec.ts

Save as: tests/account-management/new-test.spec.ts
```

**Why This Works:**
- ✅ Single source of truth (FRAMEWORK-GUIDELINES.md)
- ✅ No duplication in prompt files
- ✅ Easy to maintain and update
- ✅ Copilot reads the guidelines document

---

## 📋 Copy-Paste Ready Copilot Prompts

### **For Demo (Simple & Clean)**
```
Execute this prompt file using Playwright MCP and generate the test script:
prompts/AccountManagement/create-account-api-to-ui-e2e.prompt

Use the framework patterns from existing tests in tests/account-management/ folder.
```

### **For Production (Detailed & Accurate)**
```
Read the prompt file: prompts/AccountManagement/create-account-api-to-ui-e2e.prompt

Generate a Playwright test using our framework architecture:
- Reference: tests/account-management/copilot-generated-demo.spec.ts (working example)
- Import fixtures from: ../../src/fixtures/test-fixtures
- ApiHelper responses: { status, body, response } - access data via .body
- Base URL: https://parabank.parasoft.com
- API path: /parabank/services/bank/
- Use page.locator() with has-text for UI verification
- Add comprehensive logging with console.log()
- Include try-catch for error handling

Save as: tests/account-management/[descriptive-name].spec.ts
```

---

## 🎓 Teaching Copilot Your Framework

### **Option 1: Include Framework Context in Prompts** ⭐ RECOMMENDED
Add framework instructions at the top of every prompt file (see `_FRAMEWORK_TEMPLATE.txt`)

### **Option 2: Reference Working Examples**
```
Generate test like tests/account-management/copilot-generated-demo.spec.ts 
but for this scenario: prompts/AccountManagement/new-scenario.prompt
```

### **Option 3: Use .copilotignore or Workspace Context**
Copilot automatically learns from your open files. Keep these open:
- `src/fixtures/test-fixtures.ts`
- `src/helpers/ApiHelper.ts`
- `src/helpers/UiHelper.ts`
- A working test example

---

## 🔍 How to Verify Generated Code

### **Checklist Before Running:**
- [ ] Imports correct: `from '../../src/fixtures/test-fixtures'`
- [ ] Fixtures used: `{ apiHelper, uiHelper, testContext }`
- [ ] API responses use `.body`: `response.body.id`
- [ ] Full API paths: `/parabank/services/bank/...`
- [ ] Wait for load: `page.waitForLoadState('networkidle')`
- [ ] Timeout on checks: `{ timeout: 15000 }`
- [ ] Console logging included
- [ ] Test context used for variables

---

## 💡 Pro Tips

### **1. Always Start with Working Examples**
Before demo, have Copilot generate a test once, verify it works, then use that as reference.

### **2. Incremental Validation**
Ask Copilot to generate tests step-by-step:
- "Generate just the API calls"
- "Now add the UI automation"
- "Add error handling and logging"

### **3. Show Copilot Your Patterns**
Keep 2-3 working test files open in VS Code tabs while asking Copilot to generate new ones.

### **4. Update Prompt Template Regularly**
When you discover a new pattern or fix, add it to `_FRAMEWORK_TEMPLATE.txt`

---

## 🎬 For Leadership Demo

### **What to Say When Showing Generated Code:**
✅ "Notice how Copilot followed our framework patterns - proper imports, fixtures, error handling"  
✅ "The generated code uses our ApiHelper and UiHelper abstractions correctly"  
✅ "It includes comprehensive logging for debugging and audit trails"  
✅ "All best practices are automatically applied"  

### **If Code Has Issues During Demo:**
✅ Stay calm: "This is why we have our framework - let me show you the validation step"  
✅ Reference working example: "Here's one we generated earlier that's production-ready"  
✅ Fix live: "I can quickly adjust this - see how easy it is to customize?"  

---

## 📚 Additional Resources

- **Working Test Examples:** `tests/account-management/copilot-generated-demo.spec.ts`
- **Framework Template:** `prompts/_FRAMEWORK_TEMPLATE.txt`
- **Helper Documentation:** `src/helpers/ApiHelper.ts`, `src/helpers/UiHelper.ts`
- **Fixture Setup:** `src/fixtures/test-fixtures.ts`

---

**Remember:** Copilot is a tool, not magic. Guide it with clear instructions and reference examples, and it will generate excellent code consistently! 🚀

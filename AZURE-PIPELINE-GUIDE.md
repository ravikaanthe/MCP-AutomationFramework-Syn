# 🎯 Azure Pipeline Configuration Guide

## 📍 **YAML File Location**

```
c:\Playwright Automation Projects\Playwright MCP_Script & API\azure-pipelines.yml
```

**OR use the enhanced version:**
```
c:\Playwright Automation Projects\Playwright MCP_Script & API\azure-pipelines-v2.yml
```

---

## 🚀 **How to Run Specific Tests (Smoke/Regression)**

### **Method 1: Using Parameters (Recommended)**

I've created an enhanced `azure-pipelines-v2.yml` with dropdown options:

**Available Test Suites:**
1. **smoke** - Quick smoke tests (account management only)
2. **regression** - Full regression (all modules)
3. **account-management** - Account management tests only
4. **transaction-management** - Transaction tests only
5. **customer-management** - Customer tests only
6. **loan-management** - Loan tests only
7. **payment-management** - Payment tests only
8. **security-and-auth** - Security tests only
9. **all-modules** - All tests
10. **custom** - Specify custom test path

---

## 📝 **How to Use in Azure DevOps**

### **Step 1: Update Your Pipeline**

**Option A: Replace existing file**
```powershell
# Backup old file
cd "c:\Playwright Automation Projects\Playwright MCP_Script & API"
mv azure-pipelines.yml azure-pipelines-old.yml

# Rename new file
mv azure-pipelines-v2.yml azure-pipelines.yml

# Commit and push
git add azure-pipelines.yml
git commit -m "Update Azure Pipeline with test suite selection"
git push
```

**Option B: Use new file directly**
- In Azure DevOps, edit pipeline
- Change YAML path to `/azure-pipelines-v2.yml`

---

### **Step 2: Run Pipeline with Parameters**

**In Azure DevOps:**

1. Go to **Pipelines** → Select your pipeline
2. Click **Run pipeline** button
3. You'll see dropdown: **Select Test Suite**
4. Choose your option:
   - **smoke** → Runs only account management tests
   - **regression** → Runs all module tests
   - **account-management** → Specific module
   - **custom** → Enter custom path

5. Click **Run**

---

## 📊 **Test Suite Mapping**

| Suite Selection | Command Executed | Tests Run |
|-----------------|------------------|-----------|
| **smoke** | `npm run test:account-management:ci` | Account Management only |
| **regression** | `npm run test:all-modules:ci` | All modules |
| **account-management** | `npm run test:account-management:ci` | Account Management |
| **transaction-management** | `npm run test:transaction-management:ci` | Transaction Management |
| **customer-management** | `npm run test:customer-management:ci` | Customer Management |
| **loan-management** | `npm run test:loan-management:ci` | Loan Management |
| **payment-management** | `npm run test:payment-management:ci` | Payment Management |
| **security-and-auth** | `npm run test:security-and-auth:ci` | Security & Auth |
| **all-modules** | `npm run test:all-modules:ci` | All modules |
| **custom** | `node node_modules/@playwright/test/cli.js test <your-path>` | Custom path |

---

## 🎯 **Scheduled Test Runs**

The pipeline includes automatic scheduling:

### **Smoke Tests:**
- **Frequency:** Every 4 hours
- **Command:** `npm run test:account-management:ci`
- **Purpose:** Quick validation of critical functionality

### **Regression Tests:**
- **Frequency:** Daily at 2 AM UTC
- **Command:** `npm run test:all-modules:ci`
- **Purpose:** Comprehensive end-to-end testing

---

## 🛠️ **Customization Examples**

### **Example 1: Add Sanity Test Suite**

Edit `azure-pipelines.yml`:

```yaml
parameters:
  - name: testSuite
    values:
      - smoke
      - sanity        # ADD THIS
      - regression

variables:
  ${{ if eq(parameters.testSuite, 'sanity') }}:
    TEST_COMMAND: 'npm run test:account-management:ci && npm run test:security-and-auth:ci'
```

---

### **Example 2: Run Specific Test File**

In Azure DevOps:
1. Select **custom** from dropdown
2. Enter path: `tests/account-management/copilot-generated-demo.spec.ts`
3. Run

---

### **Example 3: Add Tags-Based Testing**

**First, update `package.json`:**
```json
"scripts": {
  "test:smoke:ci": "node node_modules/@playwright/test/cli.js test --grep @smoke",
  "test:critical:ci": "node node_modules/@playwright/test/cli.js test --grep @critical"
}
```

**Then, tag your tests:**
```typescript
test('Login test @smoke @critical', async ({ page }) => {
  // test code
});
```

**Update YAML:**
```yaml
${{ if eq(parameters.testSuite, 'critical') }}:
  TEST_COMMAND: 'npm run test:critical:ci'
```

---

## 📂 **Current Structure**

Your tests are organized by module:

```
tests/
├── account-management/          → npm run test:account-management:ci
├── transaction-management/      → npm run test:transaction-management:ci
├── customer-management/         → npm run test:customer-management:ci
├── loan-management/             → npm run test:loan-management:ci
├── payment-management/          → npm run test:payment-management:ci
└── security-and-auth/           → npm run test:security-and-auth:ci
```

---

## 🎨 **Visual Guide: Azure DevOps UI**

When you click "Run pipeline", you'll see:

```
┌─────────────────────────────────────┐
│  Select Test Suite  [dropdown ▼]   │
├─────────────────────────────────────┤
│  ● smoke                            │
│  ● regression                       │
│  ● account-management               │
│  ● transaction-management           │
│  ● customer-management              │
│  ● loan-management                  │
│  ● payment-management               │
│  ● security-and-auth                │
│  ● all-modules                      │
│  ● custom                           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Custom Test Path                   │
│  [tests/account-management]         │
└─────────────────────────────────────┘

          [Run] [Cancel]
```

---

## 🔄 **Update Process**

### **To Push Updated YAML:**

```powershell
cd "c:\Playwright Automation Projects\Playwright MCP_Script & API"

# Option 1: Use enhanced version
mv azure-pipelines-v2.yml azure-pipelines.yml

# Option 2: Manually edit azure-pipelines.yml
# (Open file and customize as needed)

# Commit and push
git add azure-pipelines.yml
git commit -m "Add test suite selection to Azure Pipeline"
git push
```

### **Azure DevOps will automatically:**
- Detect the YAML change
- Use new configuration on next run
- Show dropdown in UI

---

## ✅ **Benefits of This Setup**

✅ **Flexible** - Choose test suite per run  
✅ **Scheduled** - Automatic smoke (4hrs) & regression (daily)  
✅ **Modular** - Each module can be tested independently  
✅ **Custom** - Run any specific test path  
✅ **Zero Code Changes** - Just select dropdown option  

---

## 🎯 **Common Use Cases**

### **Use Case 1: Quick Smoke Test Before Release**
- Select: **smoke**
- Time: ~5 minutes
- Tests: Critical account management flows

### **Use Case 2: Full Regression Before Production Deploy**
- Select: **regression**
- Time: ~20-30 minutes
- Tests: All modules end-to-end

### **Use Case 3: Test New Feature in Specific Module**
- Select: **custom**
- Path: `tests/account-management/new-feature.spec.ts`
- Time: Depends on test

### **Use Case 4: Validate API Changes**
- Select: **transaction-management**
- Time: ~5-10 minutes
- Tests: Transaction module only

---

## 📊 **Pipeline Execution Flow**

```
Manual Trigger or Scheduled
         ↓
Select Test Suite (smoke/regression/etc.)
         ↓
Install Node.js & Dependencies
         ↓
Install Playwright Browsers
         ↓
Execute Selected Test Suite
         ↓
Publish Test Results (JUnit XML)
         ↓
Publish HTML Report (Artifacts)
         ↓
Success/Failure Notification
```

---

## 🚀 **Next Steps**

1. ✅ Push updated YAML to GitHub
2. ✅ Run pipeline in Azure DevOps
3. ✅ Test smoke suite
4. ✅ Test regression suite
5. ✅ Schedule automatic runs
6. ✅ Share results with team

---

## 📞 **Quick Reference**

**File Location:**  
`c:\Playwright Automation Projects\Playwright MCP_Script & API\azure-pipelines.yml`

**Push Command:**
```powershell
git add azure-pipelines.yml
git commit -m "Update pipeline configuration"
git push
```

**Azure DevOps:**  
Pipelines → Your Pipeline → Run pipeline → Select Suite → Run

---

**You're all set for flexible CI/CD testing!** 🎉

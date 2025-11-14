# 🚀 Quick Start - Creating New Test Prompts

## 📋 3-Step Process

### **Step 1: Create Your Prompt File**
```bash
# Copy the template
cp prompts/_FRAMEWORK_TEMPLATE.txt prompts/[YourModule]/[test-name].prompt

# Edit and fill in your test steps
```

**No need to add framework instructions - they're centralized in `prompts/FRAMEWORK-GUIDELINES.md`!**

---

### **Step 2: Ask Copilot to Generate Test**

**Copy-Paste This Copilot Prompt:**
```
Read the prompt file at: prompts/[YourModule]/[test-name].prompt

Generate a Playwright test following the framework guidelines in:
prompts/FRAMEWORK-GUIDELINES.md

Reference this working example for patterns:
tests/account-management/copilot-generated-demo.spec.ts

Save as: tests/[your-module]/[descriptive-name].spec.ts
```

---

### **Step 3: Verify & Run**
```bash
# Run the generated test
npx playwright test tests/[your-module]/[test-name].spec.ts --headed

# If it works, you're done!
# If not, check against FRAMEWORK-GUIDELINES.md
```

---

## 📁 File Structure

```
prompts/
├── FRAMEWORK-GUIDELINES.md      ← 🎯 Single source of truth
├── _FRAMEWORK_TEMPLATE.txt      ← 📋 Copy this for new prompts
├── AccountManagement/
│   └── your-test.prompt         ← ✏️ Just test steps, no framework code
├── TransactionManagement/
│   └── your-test.prompt
└── [Other Modules]/
    └── your-test.prompt
```

---

## ✅ Benefits

| Old Way | New Way |
|---------|---------|
| ❌ Copy framework instructions to every prompt | ✅ Reference one central document |
| ❌ Update 20+ files when framework changes | ✅ Update 1 file (FRAMEWORK-GUIDELINES.md) |
| ❌ Risk of inconsistency | ✅ Always consistent |
| ❌ Bloated prompt files | ✅ Clean, focused prompts |

---

## 🎯 For Your Demo

**Show leadership this workflow:**

1. **"Here's our test scenario"** → Open simple prompt file
2. **"Watch Copilot read our framework guidelines"** → Paste Copilot command
3. **"It generates production-ready code"** → Show generated test
4. **"Let's prove it works"** → Run test, show passing

**Key Message:**
> "We've codified our framework best practices into reusable guidelines. Every test Copilot generates automatically follows our standards - no manual effort needed!"

---

## 📞 Need Help?

- **Framework patterns:** See `prompts/FRAMEWORK-GUIDELINES.md`
- **Template:** Copy `prompts/_FRAMEWORK_TEMPLATE.txt`
- **Working example:** Check `tests/account-management/copilot-generated-demo.spec.ts`
- **Best practices:** Read `COPILOT-BEST-PRACTICES.md`

---

**Updated:** November 13, 2025

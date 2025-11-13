# 🚀 CI/CD Quick Reference

## Commands

### **For CI/CD Pipelines (Headless Mode):**

```bash
npm run test:account-management:ci      # Account tests
npm run test:all-modules:ci             # All tests
```

**Key difference:** No `--headed` flag = headless mode = works in CI/CD

---

## GitHub Actions

**File:** `.github/workflows/playwright-tests.yml` ✅ **Already created**

**Setup:**
1. Push to GitHub
2. Go to **Actions** tab
3. Tests run automatically!

**Triggers:**
- Every push to main/develop
- Every pull request
- Daily at 2 AM UTC

---

## Azure Pipelines

**File:** `azure-pipelines.yml` ✅ **Already created**

**Setup:**
1. Azure DevOps → Pipelines → New Pipeline
2. Select existing YAML file: `azure-pipelines.yml`
3. Run!

**Triggers:**
- Every push to main/develop
- Every pull request
- Daily at 2 AM UTC

---

## Jenkins

**Setup:**
1. Create `Jenkinsfile` (example in CI-CD-GUIDE.md)
2. Install "HTML Publisher Plugin"
3. Create Pipeline job pointing to your repo

**Command in Jenkins:**
```bash
npm run test:account-management:ci
```

---

## What You Get

✅ **Automatic test execution** on every code change  
✅ **HTML reports** with screenshots and timing  
✅ **Test result integration** with CI platform  
✅ **Scheduled daily runs** for regression  
✅ **Artifact storage** (reports kept for 30 days)  

---

## Quick Test

Test your CI/CD setup locally:

```bash
# This simulates CI environment (headless mode)
npm run test:account-management:ci
```

If it works locally in headless mode, it will work in CI/CD!

---

## For Leadership Demo

Show them these pipeline files:
- `.github/workflows/playwright-tests.yml`
- `azure-pipelines.yml`
- `CI-CD-GUIDE.md`

**Say:**
> "We have complete CI/CD integration ready. Push to GitHub or Azure Repos and tests run automatically on every commit. Daily scheduled runs ensure continuous regression testing. Reports are automatically archived and accessible to the team."

---

**Full details:** See `CI-CD-GUIDE.md`

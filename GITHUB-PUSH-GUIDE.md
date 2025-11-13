# 🚀 GitHub Push & Azure DevOps CI/CD Setup Guide

## Step-by-Step Instructions

### **Step 1: Configure Git (First Time Only)**

If you haven't configured Git globally yet:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### **Step 2: Initialize Git and Add Remote**

Run these commands in PowerShell:

```powershell
# Navigate to your project
cd "c:\Playwright Automation Projects\Playwright MCP_Script & API"

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Playwright MCP Framework with CI/CD support"

# Add your GitHub repository as remote
git remote add origin https://github.com/ravikaanthe/MCP-AutomationFramework-Syn.git

# Verify remote was added
git remote -v

# Push to GitHub (creates main branch)
git push -u origin main
```

**If you get an error about branch name, try:**
```powershell
# Rename current branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

### **Step 3: Authenticate with GitHub**

When you run `git push`, you'll be prompted for credentials:

**Option A: Personal Access Token (Recommended)**
1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (all checkboxes under repo)
4. Generate token and copy it
5. Use token as password when pushing

**Option B: GitHub CLI**
```powershell
# Install GitHub CLI if not installed
winget install GitHub.cli

# Login
gh auth login

# Then push normally
git push -u origin main
```

---

### **Step 4: Verify Push Succeeded**

After pushing, verify your code is on GitHub:
1. Go to: https://github.com/ravikaanthe/MCP-AutomationFramework-Syn
2. Refresh the page
3. You should see all your files

---

### **Step 5: Set Up Azure DevOps Pipeline**

#### **Option A: Using GitHub Actions (Easiest)**

Since your code is now on GitHub, the GitHub Actions workflow will run automatically:

1. Go to: https://github.com/ravikaanthe/MCP-AutomationFramework-Syn/actions
2. You should see workflow runs
3. Click on a run to see test results

**That's it!** GitHub Actions will:
- Run on every push
- Run on pull requests
- Run daily at 2 AM UTC

---

#### **Option B: Using Azure Pipelines**

If you want to use Azure DevOps instead:

**1. Create Azure DevOps Project:**
   - Go to: https://dev.azure.com/
   - Create new project (e.g., "Playwright-Automation")

**2. Connect GitHub Repository:**
   - Go to Pipelines → New Pipeline
   - Select "GitHub" as source
   - Select your repository: `ravikaanthe/MCP-AutomationFramework-Syn`
   - Authorize Azure Pipelines to access your GitHub

**3. Configure Pipeline:**
   - Select "Existing Azure Pipelines YAML file"
   - Choose `/azure-pipelines.yml`
   - Click "Run"

**4. Save and Run:**
   - Pipeline will start automatically
   - Tests will run in Azure's cloud agents
   - View results in Azure DevOps Pipelines page

---

### **Step 6: View Test Results**

#### **GitHub Actions:**
- URL: https://github.com/ravikaanthe/MCP-AutomationFramework-Syn/actions
- Click on workflow run → See test execution
- Download artifacts (playwright-report)

#### **Azure Pipelines:**
- Go to your Azure DevOps project
- Click Pipelines → Select your pipeline
- View test results and download reports

---

## 🔥 Quick Commands Summary

```powershell
# One-time setup
cd "c:\Playwright Automation Projects\Playwright MCP_Script & API"
git init
git add .
git commit -m "Initial commit: Playwright MCP Framework with CI/CD support"
git remote add origin https://github.com/ravikaanthe/MCP-AutomationFramework-Syn.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Your commit message"
git push
```

---

## 🎯 What Happens After Push?

✅ **Automatically:**
- GitHub Actions workflow triggers
- Chromium browser installs
- Tests run in headless mode
- Reports generated
- Results visible in Actions tab

✅ **On Every:**
- Push to main/develop
- Pull request
- Daily at 2 AM UTC

---

## 🆘 Troubleshooting

### **Error: "remote origin already exists"**
```powershell
git remote remove origin
git remote add origin https://github.com/ravikaanthe/MCP-AutomationFramework-Syn.git
```

### **Error: "src refspec main does not match any"**
```powershell
# Make sure you committed first
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### **Error: "Authentication failed"**
- Use Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

### **Error: "Repository not found"**
- Verify repository URL is correct
- Verify you have access to the repository
- Check if repository exists on GitHub

---

## 📊 Expected Pipeline Behavior

**After push, GitHub Actions will:**

1. ✅ Install Node.js 20
2. ✅ Install dependencies (`npm ci`)
3. ✅ Install Chromium browser
4. ✅ Run account management tests
5. ✅ Run all module tests
6. ✅ Generate HTML reports
7. ✅ Upload artifacts (reports available for 30 days)

**Total time:** ~5-10 minutes

---

## 🎉 Success Indicators

You'll know it worked when:

✅ GitHub shows your files at: https://github.com/ravikaanthe/MCP-AutomationFramework-Syn  
✅ Green checkmark appears next to commit  
✅ Actions tab shows "All workflows have passed"  
✅ You can download playwright-report artifact  

---

## 📞 Next Steps

After successful push:

1. ✅ Verify code on GitHub
2. ✅ Check GitHub Actions results
3. ✅ Share repository link with team
4. ✅ (Optional) Set up Azure Pipelines if needed
5. ✅ Configure branch protection rules
6. ✅ Set up notifications for failures

---

**Ready to push? Run the commands from Step 2!** 🚀

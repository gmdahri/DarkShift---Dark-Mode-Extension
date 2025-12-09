# GitHub Pages Setup Guide

This guide will help you deploy the DarkShift landing page to GitHub Pages.

## Prerequisites

- A GitHub repository for your project
- Git installed on your local machine
- Push access to the repository

## Step 1: Push Changes to GitHub

First, ensure all your changes are committed and pushed:

```bash
# Add all files
git add .

# Commit changes
git commit -m "Add landing page for GitHub Pages deployment"

# Push to GitHub
git push origin main
```

## Step 2: Enable GitHub Pages

1. **Go to your GitHub repository** in your browser:
   - Navigate to: `https://github.com/gmdahri/DarkShift---Dark-Mode-Extension`

2. **Open Repository Settings**:
   - Click on "Settings" tab at the top of the repository

3. **Navigate to Pages Settings**:
   - In the left sidebar, click on "Pages" (under "Code and automation")

4. **Configure GitHub Pages**:
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main` (or your default branch)
   - **Folder**: Select `/docs`
   - Click "Save"

## Step 3: Wait for Deployment

- GitHub will automatically build and deploy your site
- This usually takes 1-2 minutes
- You'll see a green checkmark when deployment is complete
- The URL will be displayed at the top: `https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/`

## Step 4: Verify Deployment

1. **Check the Actions Tab**:
   - Go to the "Actions" tab in your repository
   - You should see a workflow run for "pages build and deployment"
   - Wait for it to complete (green checkmark)

2. **Visit Your Site**:
   - Navigate to: `https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/`
   - Your landing page should be live!

## Custom Domain (Optional)

If you want to use a custom domain:

1. **Add a CNAME file** to the `docs` folder:
```bash
echo "yourdomain.com" > docs/CNAME
```

2. **Configure DNS**:
   - Add a CNAME record pointing to `gmdahri.github.io`
   - Or add A records for GitHub Pages IPs

3. **Update in GitHub Settings**:
   - Go to Settings > Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## Automatic Deployment

We've included a GitHub Actions workflow (`.github/workflows/pages.yml`) that will:
- Automatically deploy changes when you push to the `docs` folder
- Can be manually triggered from the Actions tab

## Updating the Landing Page

When you need to update the landing page:

1. **Edit files** in the `/landing` directory:
```bash
# Edit the files
vim landing/index.html
vim landing/styles.css
vim landing/script.js
```

2. **Copy to docs folder**:
```bash
cp landing/*.{html,css,js} docs/
```

3. **Commit and push**:
```bash
git add docs/
git commit -m "Update landing page"
git push origin main
```

4. **Deployment happens automatically**
   - GitHub Actions will detect the change
   - Site will be updated in 1-2 minutes

## Troubleshooting

### Site not loading
- Check that GitHub Pages is enabled in Settings > Pages
- Verify the branch and folder are correctly set
- Check the Actions tab for any deployment errors

### 404 Error
- Ensure `index.html` exists in the `docs` folder
- Check file names are lowercase (case-sensitive)
- Clear your browser cache

### Changes not appearing
- Wait 2-3 minutes for deployment to complete
- Check the Actions tab to see if deployment succeeded
- Hard refresh your browser (Cmd/Ctrl + Shift + R)
- Clear browser cache

### Workflow not running
- Ensure the workflow file is at `.github/workflows/pages.yml`
- Check that GitHub Actions are enabled in Settings > Actions
- Verify you have push permissions to the repository

## Files Structure

```
/docs                     # GitHub Pages source folder
├── index.html           # Main landing page
├── styles.css           # Styling
├── script.js            # JavaScript functionality
├── privacy.html         # Privacy policy page
├── privacy.md           # Privacy policy (Markdown)
└── README.md            # Documentation

/.github/workflows       # GitHub Actions
└── pages.yml           # Automatic deployment workflow
```

## GitHub Pages URLs

- **Production URL**: `https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/`
- **Privacy Policy**: `https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/privacy.html`

## Benefits of GitHub Pages

✅ **Free hosting**
✅ **Automatic HTTPS**
✅ **Fast CDN delivery**
✅ **Version controlled**
✅ **Easy updates via Git**
✅ **Custom domain support**
✅ **Automatic deployment**

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)

## Support

If you encounter issues:
1. Check the [GitHub Pages status](https://www.githubstatus.com/)
2. Review the Actions logs for error messages
3. Open an issue in the repository
4. Check GitHub Pages documentation

---

**Your landing page is now ready to be deployed! Follow the steps above to get it live.** 🚀


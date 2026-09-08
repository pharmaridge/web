# PharmaRidge web — maintenance and deployment guide

Repository: `https://github.com/pharmaridge/web`

Live site: `https://pharmaridge.github.io/web/`

## 1. One-time Windows / PowerShell / VS Code setup

Install Git for Windows and VS Code. In PowerShell, configure your Git identity:

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Use the current GitHub SSH key. If the key is already registered with GitHub, test it:

```powershell
ssh -T git@github.com
```

A successful response normally says that GitHub authenticated you. Never paste a GitHub personal access token into the repository, a script, or a remote URL.

If a key has not been created yet:

```powershell
ssh-keygen -t ed25519 -C "you@example.com"
Get-Content $HOME\.ssh\id_ed25519.pub | Set-Clipboard
```

Add the copied public key at GitHub: **Settings → SSH and GPG keys → New SSH key**.

## 2. Pull the current website over SSH

Clone it once:

```powershell
cd $HOME\Documents
git clone git@github.com:pharmaridge/web.git
cd .\web
code .
```

If the folder already exists, switch to the deployed branch and pull safely:

```powershell
cd $HOME\Documents\web
git remote set-url origin git@github.com:pharmaridge/web.git
git switch main
git pull --ff-only origin main
code .
```

Confirm the remote is using SSH:

```powershell
git remote -v
```

It should show `git@github.com:pharmaridge/web.git` for fetch and push.

## 3. Make and preview a change in VS Code

This is a static site. The main files are:

- `index.html` — page content and structure
- `styles.css` — layout, responsive design, animation and visual styling
- `app.js` — carousels, admin drawer, client showcase and browser storage
- `assets/` — only the image assets used by the public site

Run a local preview from the VS Code terminal:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173` in a browser. Stop the server with `Ctrl+C`.

Before committing, check the change:

```powershell
git status
git diff
```

## 4. Commit, push and redeploy

GitHub Pages redeploys automatically after a push to `main` through `.github/workflows/pages.yml`.

```powershell
git add index.html styles.css app.js assets PHARMARIDGE_SETUP.md .github\workflows\pages.yml
git commit -m "Describe the change"
git push origin main
```

Monitor deployment at:

`https://github.com/pharmaridge/web/actions`

After the workflow succeeds, allow a minute or two for cache refresh and then open:

`https://pharmaridge.github.io/web/`

If a push is rejected, do not use a personal access token in the remote URL. Confirm that the SSH key belongs to a GitHub account with write access to `pharmaridge/web`.

## 5. Admin workspace

The admin entry point is intentionally discreet and is not displayed in the main navigation.

Find it at the very bottom of the public website footer:

**Privacy · Terms · Workspace access**

Click **Workspace access** to open the admin drawer.

### Current credentials

There are currently **no username or password credentials**. This project contains a front-end demo admin drawer, not a secured production admin backend. Its edits are stored in the browser's `localStorage` and are only visible in that browser.

The drawer currently supports editing:

- Support email
- Phone number
- Head office
- Plan pricing
- Announcement message
- Client name
- Client logo upload
- Client story
- Removing client showcase entries

### Important production note

Do not use the current browser-only admin for real customer, pricing or client data. Before launch, add a real authentication and backend service with:

- Server-side sessions or a managed identity provider
- Password reset and MFA
- Role-based permissions
- Database-backed settings and client profiles
- Secure image storage
- Audit logs
- Server-side validation

The current admin is suitable for design review and static-site demonstrations only.

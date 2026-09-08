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

## 6. Production admin portal

The production admin portal is available at:

`https://pharmaridge.github.io/web/admin.html`

It is powered by Supabase and supports:

- Email/password authentication
- Authenticated client management
- Client logo uploads to Supabase Storage
- Public client showcase publishing
- Client removal
- Row-level security policies

### Supabase setup

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL Editor.
3. In Supabase Authentication, create the first admin user under **Authentication → Users**.
4. In the GitHub repository, open **Settings → Secrets and variables → Actions**.
5. Add these repository secrets:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
```

6. Push to `main` or manually run the Pages workflow.
7. Open `/web/admin.html` and sign in with the Supabase admin user.

The Supabase anon key is designed to be exposed in a browser. Never put the Supabase service-role key in GitHub Pages, JavaScript, or the repository. The SQL policies are the security boundary.

The current client showcase in `app.js` is retained as a local fallback for design preview, while `public-data.js` reads published client profiles from Supabase in production.

## Changeable public site details

After running the updated `supabase-schema.sql`, sign in at `/web/admin.html`. The **Public site settings** panel lets an authenticated administrator change:

- Contact email
- Contact number
- Head office
- Top announcement
- Essential plan price
- Partner plan price

Changes are stored in Supabase and read by the public website. Do not edit these values in the browser developer tools; use the authenticated admin portal so the database remains the source of truth.

## Video and document libraries

Run `supabase-media-extension.sql` in Supabase SQL Editor to create:

- `video_library` for YouTube videos
- `resource_library` for Google Docs and other Google document links

From the admin portal, choose **YouTube video** or **Google document link** in the content type selector. Enter a title, a dynamic category, the YouTube/Google URL and a description.

Published videos appear in the public video library with YouTube key-frame thumbnails and play links. Categories become filter buttons automatically. Published documents appear in the resource library and open in a new tab.

## Website enquiries

The contact form stores each enquiry in Supabase table `inquiries` with:

- Email
- Enquiry type
- Message
- Status (`new`, `in_progress`, `resolved`, `archived`)
- Created and updated timestamps

Run `supabase-inquiries.sql` in Supabase SQL Editor. Then open the admin portal and choose **Enquiries**. Admins can review, change status or delete enquiries.

The public form does not expose private admin data. Visitors have insert-only access; only authenticated admins can read, update or delete the inbox. For email notifications, connect a Supabase Edge Function or an automation service such as Resend after the insert trigger.

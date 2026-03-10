# VPS Deployment Guide — Dynamic Green Energy

## What You Need

- A VPS running **Ubuntu 20.04 / 22.04** with Node.js 18+ and Nginx installed
- PM2 installed globally: `npm install -g pm2`
- SSH access to your VPS

---

## The Core Rule — Build Locally, Upload Pre-Built

> **Never run `npm run build` on the VPS directly.**
> The build tool (`esbuild`) is a dev dependency and is not installed when you do
> `npm install --production`. Always build on your local machine first.

---

## METHOD A — Automated (recommended)

Run this single command on your **local machine**:

```bash
bash deploy/deploy.sh YOUR_VPS_IP
```

This will:
1. Run `npm install` + `npm run build` locally
2. Package only the pre-built `dist/` folder (no dev tools included)
3. Upload and start/reload the app on your VPS via PM2

---

## METHOD B — Manual Steps (if you uploaded source code to VPS)

If you already copied the source code onto the VPS, run these commands **on the VPS**:

```bash
cd /home/dynamicgreenenergy/htdocs/www.dynamicgreenenergy.in/dynamicgreenenergy

# Step 1: Install ALL dependencies (including devDependencies needed for build)
npm install

# Step 2: Build the production bundle
npm run build

# Step 3: Remove dev dependencies to save space (optional but recommended)
npm prune --production

# Step 4: Create log directory
mkdir -p /var/log/dge

# Step 5: Copy PM2 config and start the app
cp deploy/ecosystem.config.cjs ecosystem.config.cjs
pm2 start ecosystem.config.cjs --env production
pm2 save
```

---

## Configure Nginx (add this site alongside your existing 3 apps)

```bash
# Copy the config (won't touch your existing sites)
cp deploy/nginx.conf /etc/nginx/sites-available/dynamic-green-energy
ln -s /etc/nginx/sites-available/dynamic-green-energy /etc/nginx/sites-enabled/

# Test and reload (safe — won't restart other sites)
nginx -t && systemctl reload nginx
```

> Make sure to update the `server_name` in `deploy/nginx.conf` to your actual domain.

---

## Set Up Free SSL with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d dynamicgreenenergy.in -d www.dynamicgreenenergy.in
```

---

## Updating the Website in Future

From your local machine:

```bash
bash deploy/deploy.sh YOUR_VPS_IP
```

Or manually on the VPS:

```bash
cd /path/to/your/app
npm install        # full install (needed for esbuild)
npm run build      # build the app
npm prune --production  # clean up dev deps
pm2 reload ecosystem.config.cjs --env production
```

---

## Quick Verify

```bash
# Check the app is running on port 6000
pm2 status
curl http://localhost:6000

# Check Nginx is forwarding correctly
curl http://dynamicgreenenergy.in

# View live logs
pm2 logs dynamic-green-energy
```

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find package 'esbuild'` | Ran `npm install --production` before building | Run `npm install` (full) then `npm run build` |
| `EADDRINUSE: port 6000` | Another app is using port 6000 | Change PORT in `ecosystem.config.cjs` to a free port |
| `502 Bad Gateway` | Node app not running | Check `pm2 status` and `pm2 logs` |
| `nginx: [emerg] duplicate` | Two sites with same `server_name` | Check existing Nginx site configs |

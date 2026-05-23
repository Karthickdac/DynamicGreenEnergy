# VPS Deployment Guide — DGE ERP

**VPS path:** `/home/dynamicgreenenergy-erp/htdocs/erp.dynamicgreenenergy.in`  
**Domain:** `erp.dynamicgreenenergy.in`  
**Port:** `6100`  
**GitHub:** `https://github.com/Karthickdac/DynamicGreenEnergy`

---

## First-Time Setup (run once on VPS)

SSH into your VPS, then run:

```bash
# 1. Install Node.js 20 (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2 globally
sudo npm install -g pm2

# 3. Clone the repo into the correct folder
mkdir -p /home/dynamicgreenenergy-erp/htdocs
cd /home/dynamicgreenenergy-erp/htdocs
git clone https://github.com/Karthickdac/DynamicGreenEnergy erp.dynamicgreenenergy.in

# 4. Create log directory
mkdir -p /home/dynamicgreenenergy-erp/logs

# 5. Install dependencies and build
cd /home/dynamicgreenenergy-erp/htdocs/erp.dynamicgreenenergy.in
npm install
npm run build

# 6. Start the app with PM2
pm2 start deploy/ecosystem.config.cjs --env production
pm2 save
pm2 startup   # follow the printed command to enable auto-start on reboot
```

---

## Updating After a Code Change (pull & rebuild)

SSH into your VPS and run:

```bash
cd /home/dynamicgreenenergy-erp/htdocs/erp.dynamicgreenenergy.in

git pull origin main
npm install
npm run build
pm2 reload dge-erp --env production
```

That's it — zero downtime reload.

---

## Nginx Setup (run once)

```bash
# Copy the config
sudo cp /home/dynamicgreenenergy-erp/htdocs/erp.dynamicgreenenergy.in/deploy/nginx.conf \
        /etc/nginx/sites-available/dge-erp

# Enable it
sudo ln -s /etc/nginx/sites-available/dge-erp /etc/nginx/sites-enabled/

# Test and reload (safe — won't affect other sites)
sudo nginx -t && sudo systemctl reload nginx
```

---

## SSL with Let's Encrypt (run once after DNS is pointing to the VPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d erp.dynamicgreenenergy.in
```

Certbot will automatically update nginx.conf with HTTPS settings.

---

## Quick Health Check

```bash
pm2 status                          # app should show "online"
curl http://localhost:6100          # should return HTML
pm2 logs dge-erp --lines 50        # live logs
```

---

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find package 'esbuild'` | Ran `npm install --production` | Run plain `npm install` then `npm run build` |
| `EADDRINUSE: port 6100` | Port taken by another app | Change PORT in `deploy/ecosystem.config.cjs` |
| `502 Bad Gateway` | Node app not running | Check `pm2 status` and `pm2 logs dge-erp` |
| `git pull` asks for password | No credentials cached | Use `git config credential.helper store` or a deploy key |

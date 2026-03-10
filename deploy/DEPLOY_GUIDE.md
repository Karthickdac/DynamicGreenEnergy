# VPS Deployment Guide — Dynamic Green Energy

## What You Need Before Starting

- A VPS running **Ubuntu 22.04** (recommended) from any provider (DigitalOcean, Hostinger, AWS, etc.)
- At least **1 GB RAM, 1 CPU, 20 GB storage**
- Your VPS **IP address** and **root password / SSH key**
- A domain name pointed to your VPS IP (e.g., dynamicgreenenergy.in)

---

## STEP 1 — First-Time VPS Setup (do this once)

SSH into your VPS:
```bash
ssh root@YOUR_VPS_IP
```

Then run these commands one by one:

```bash
# Update the server
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Nginx
apt install -y nginx

# Install PM2 (keeps your app running)
npm install -g pm2

# Set PM2 to auto-start on server reboot
pm2 startup systemd
# Copy and run the command it shows you

# Create log folder
mkdir -p /var/log/dge
```

---

## STEP 2 — Upload and Deploy the App

On your **local computer** (not the VPS), run:

```bash
bash deploy/deploy.sh YOUR_VPS_IP
```

This will automatically:
1. Build the app
2. Upload it to your VPS
3. Start it with PM2

---

## STEP 3 — Configure Nginx

On your VPS:

```bash
# Copy the Nginx config
cp /var/www/dynamic-green-energy/deploy/nginx.conf /etc/nginx/sites-available/dynamic-green-energy

# Enable the site
ln -s /etc/nginx/sites-available/dynamic-green-energy /etc/nginx/sites-enabled/

# Remove the default site
rm -f /etc/nginx/sites-enabled/default

# Test the Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx
```

Your site is now live at **http://YOUR_VPS_IP** or **http://dynamicgreenenergy.in**

---

## STEP 4 — Set Up Free SSL (HTTPS) with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d dynamicgreenenergy.in -d www.dynamicgreenenergy.in

# Auto-renewal is set up automatically. Test it with:
certbot renew --dry-run
```

After this, open `deploy/nginx.conf`, uncomment the HTTPS server block, and reload Nginx.

---

## STEP 5 — Point Your Domain to the VPS

Log into your domain registrar (GoDaddy, BigRock, etc.) and add these DNS records:

| Type | Name | Value             |
|------|------|-------------------|
| A    | @    | YOUR_VPS_IP       |
| A    | www  | YOUR_VPS_IP       |

DNS changes take **1–24 hours** to propagate.

---

## Updating the Website Later

Every time you make changes, just run from your local machine:

```bash
bash deploy/deploy.sh YOUR_VPS_IP
```

It will rebuild and hot-reload the app with zero downtime.

---

## Useful Commands on the VPS

```bash
# Check if app is running
pm2 status

# View live app logs
pm2 logs dynamic-green-energy

# Restart the app manually
pm2 restart dynamic-green-energy

# Check Nginx status
systemctl status nginx

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

---

## Recommended VPS Providers (India-friendly)

| Provider     | Recommended Plan       | Price/month |
|--------------|------------------------|-------------|
| Hostinger    | KVM 1 (1GB RAM)        | ~₹300       |
| DigitalOcean | Basic Droplet (1GB)    | ~$6 (~₹500) |
| AWS Lightsail| Linux 1GB              | ~$5 (~₹420) |
| Hetzner      | CX11 (2GB RAM)         | ~€3.5       |

---

## File Structure on the VPS

```
/var/www/dynamic-green-energy/
  dist/
    index.cjs          ← Node.js server
    public/            ← React app (HTML, CSS, JS, images)
  ecosystem.config.cjs ← PM2 config
  package.json
  node_modules/
/var/log/dge/
  out.log              ← App output logs
  error.log            ← App error logs
/etc/nginx/sites-available/dynamic-green-energy  ← Nginx config
```

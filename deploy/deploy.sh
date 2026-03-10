#!/bin/bash
# ============================================================
# Dynamic Green Energy - VPS Deployment Script
# Run this on your LOCAL machine (not on the VPS)
# Usage: bash deploy/deploy.sh YOUR_VPS_IP
# ============================================================

set -e

VPS_IP="${1:?Usage: bash deploy/deploy.sh <VPS_IP>}"
VPS_USER="root"
APP_DIR="/var/www/dynamic-green-energy"
LOG_DIR="/var/log/dge"

echo "=> Building production bundle locally..."
npm install
npm run build

echo "=> Creating deployment package (pre-built dist only)..."
tar -czf dge-deploy.tar.gz \
  dist/ \
  deploy/ecosystem.config.cjs \
  package.json \
  package-lock.json

echo "=> Uploading to VPS at $VPS_IP..."
scp dge-deploy.tar.gz $VPS_USER@$VPS_IP:/tmp/dge-deploy.tar.gz

echo "=> Running setup on VPS..."
ssh $VPS_USER@$VPS_IP bash << EOF
  set -e

  # Create app and log directories
  mkdir -p $APP_DIR $LOG_DIR

  # Clear old files and extract the new package
  rm -rf $APP_DIR/dist $APP_DIR/package.json $APP_DIR/package-lock.json $APP_DIR/ecosystem.config.cjs
  tar -xzf /tmp/dge-deploy.tar.gz -C $APP_DIR
  rm /tmp/dge-deploy.tar.gz

  # Install ONLY production dependencies (no build tools needed — dist is pre-built)
  cd $APP_DIR
  npm install --omit=dev --ignore-scripts

  # Copy PM2 ecosystem config to app root
  cp $APP_DIR/deploy/ecosystem.config.cjs $APP_DIR/ecosystem.config.cjs

  # Start or reload PM2
  if pm2 list | grep -q "dynamic-green-energy"; then
    pm2 reload $APP_DIR/ecosystem.config.cjs --env production
    echo "App reloaded with PM2."
  else
    pm2 start $APP_DIR/ecosystem.config.cjs --env production
    pm2 save
    echo "App started with PM2."
  fi

  echo "=> Deployment complete!"
EOF

rm -f dge-deploy.tar.gz
echo ""
echo "Deployment finished. Your site should be live at http://$VPS_IP"

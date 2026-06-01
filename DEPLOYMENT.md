# HDX-CLOUD VPS Deployment & Production Guide

This guide describes how to deploy the **HDX-CLOUD** full-stack portal to a virtual private server (VPS) running **Ubuntu** (20.04/22.04 LTS), configured with a **PostgreSQL** database, **Prisma ORM**, **Nginx** reverse proxy, and **PM2** process manager.

---

## 1. Project Directory Structure

When deployed on your VPS, your project will follow this structure:

```text
/var/www/hdx-cloud/
├── dist/                             # Compiled static frontend and bundled server
│   ├── index.html                    # Frontend main template
│   ├── assets/                       # JavaScript / CSS static bundles
│   └── server.cjs                    # Compiled production Express server (bundled via esbuild)
├── prisma/
│   └── schema.prisma                 # Production Prisma schema with PostgreSQL support
├── hdx_database.db                   # Local SQLite file (Only if choosing developer fallback)
├── package.json
├── package-lock.json
├── .env                              # Active environment configuration
└── DEPLOYMENT.md                     # This documentation
```

---

## 2. Server Prerequisites (Ubuntu Linux Setup)

Connect to your VPS via SSH and install the fundamental dependency packages:

```bash
# Update Ubuntu package indices
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 or v20 carbon LTS recommended) and NPM
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify runtimes
node -v
npm -v

# Install Git and build-essential elements
sudo apt install -y git build-essential curl ufw
```

---

## 3. PostgreSQL Database Setup

1. Install PostgreSQL server locally on the VPS:
   ```bash
   sudo apt install -y postgresql postgresql-contrib
   ```

2. Access the secure database CLI and create your user and database:
   ```bash
   sudo -i -u postgres psql
   ```

3. Inside the `psql` interactive prompt, run the following SQL commands (replace `SecureHdxPassword123` with any ultra-strong secret password):
   ```sql
   CREATE DATABASE hdx_portal;
   CREATE USER hdx_db_admin WITH PASSWORD 'SecureHdxPassword123';
   GRANT ALL PRIVILEGES ON DATABASE hdx_portal TO hdx_db_admin;
   ALTER DATABASE hdx_portal OWNER TO hdx_db_admin;
   \q
   ```

---

## 4. Deploying & Bootstrapping the Files

1. Create a home directory structure for your application and clone/upload your files:
   ```bash
   sudo mkdir -p /var/www/hdx-cloud
   sudo chown -R $USER:$USER /var/www/hdx-cloud
   cd /var/www/hdx-cloud
   ```

2. Place the project files in this directory.

3. Create the production `.env` configuration file:
   ```bash
   nano .env
   ```

4. Populate the `.env` with the following variables:
   ```env
   NODE_ENV="production"
   PORT=3000
   
   # JWT signature security key
   JWT_SECRET="YOUR_RANDOM_LONG_SECURE_JWT_HEX_KEY_HERE_2026"
   
   # Database connection query string targeting the local PostgreSQL server
   DATABASE_URL="postgresql://hdx_db_admin:SecureHdxPassword123@localhost:5412/hdx_portal?schema=public"
   ```

5. Install packages and generate the Prisma database layer:
   ```bash
   # Install essential dependencies
   npm install

   # Generate type-safe Prisma clients
   npx prisma generate

   # Execute PostgreSQL migrations to set up users and claims tables
   npx prisma migrate deploy
   ```

---

## 5. Production Build Process

Compile and bundle the client-side single-page UI assets together with the custom ES Express server entry point by running:

```bash
npm run build
```

This triggers:
1. `vite build` which bundles React, Lucide Icons, and compilation states into `dist`.
2. `esbuild` which resolves, bundles, and wraps the backend `server.ts` into a compressed, high-performance CommonJS `dist/server.cjs` file.

---

## 6. PM2 Process Orchestration (Live Run Setup)

Configure PM2 to keep the server running in the background and survive system reboot events:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the compiled backend Express process
pm2 start dist/server.cjs --name "hdx-cloud-portal"

# Ensure PM2 spawns and resumes after server restart reboots
pm2 save
pm2 startup
```
Copy and run the shell command printed on-screen by `pm2 startup` to configure the systemd unit files properly.

---

## 7. Nginx Routing & Reverse Proxy Setup

Nginx routes public port 80/443 browser traffic directly to your Node process running on internal port 3000.

1. Install Nginx:
   ```bash
   sudo apt install -y nginx
   ```

2. Create a new site configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/hdx-cloud
   ```

3. Enter the following server configuration block (replace `claims.hdx-cloud.com` with your active domain name):
   ```nginx
   server {
       listen 80;
       server_name claims.hdx-cloud.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. Enable the configuration and test Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/hdx-cloud /etc/nginx/sites-enabled/
   sudo nginx -t
   ```

5. Restart Nginx to apply:
   ```bash
   sudo systemctl restart nginx
   ```

---

## 8. Let's Encrypt SSL/HTTPS Security Configuration

Secure the login portals and whitelisting requests with clean HTTPS.

1. Install Certbot for Nginx:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Request a trusted SSL certificate from Let's Encrypt (Certbot will edit your Nginx files automatically):
   ```bash
   sudo certbot --nginx -d claims.hdx-cloud.com
   ```

3. Follow the prompt questions. Choose to automatically redirect HTTP traffic to HTTPS.

4. Open the firewall to allow secure traffic:
   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

Your HDX-CLOUD premium token claims manager dashboard is now live and secured at `https://claims.hdx-cloud.com`!

# Deployment Guide — BITSOL AI Assistant

_Designed & Developed by BITSOL MARKETING_

This guide covers deploying to a production Linux server using **Docker +
Nginx**, plus a **PM2** alternative and a **GitHub Actions** CI/CD outline.

---

## 1. Prerequisites

- A Linux server (Ubuntu 22.04+ recommended) with a public IP / domain
- Docker + Docker Compose **or** Node.js 20+ and PM2
- PostgreSQL 14+ (managed or containerised) and Redis (optional but recommended)
- An AI provider key (e.g. `ANTHROPIC_API_KEY`)
- A domain name and TLS certificate (Let's Encrypt)

---

## 2. Environment

```bash
git clone <your-repo-url> bitsol-assistant && cd bitsol-assistant
cp .env.example .env
```

Set production values in `.env`:

- `NODE_ENV=production`
- `APP_URL` / `NEXT_PUBLIC_APP_URL` = `https://your-domain`
- `DATABASE_URL` = production PostgreSQL
- `REDIS_URL` = production Redis — **strongly recommended in production**, or
  rate limiting fails open and allows every request
- `JWT_SECRET` = `openssl rand -base64 48`
- `AI_PROVIDER` + the matching API key and `AI_MODEL`
- `SALES_NOTIFY_EMAIL` and `ADMISSIONS_NOTIFY_EMAIL` — where new BITSOL
  Marketing leads and BITSOL Institute admission inquiries are announced
- `SEED_ADMIN_PASSWORD` / `SEED_STAFF_PASSWORD` — **change these before seeding**

Keep `.env` out of version control (already in `.gitignore`).

---

## 3. Deploy with Docker Compose (recommended)

```bash
docker compose up -d --build
docker compose exec web npx prisma migrate deploy
docker compose exec web npm run db:seed          # first deploy only
docker compose logs -f web
```

This starts `db` (Postgres), `redis`, and `web` (the app on port 3000).
Health check: `curl http://localhost:3000/api/health`.

To update:
```bash
git pull
docker compose up -d --build web
docker compose exec web npx prisma migrate deploy
```

The seed is idempotent, so re-running it after editing the service or course
catalogues in `src/data` pushes those changes into the database.

---

## 4. Nginx reverse proxy + TLS

`/etc/nginx/sites-available/bitsol`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header X-Frame-Options SAMEORIGIN always;

    client_max_body_size 15m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Streaming (SSE) — disable proxy buffering for /api/chat.
    location /api/chat {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 3600s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/bitsol /etc/nginx/sites-enabled/bitsol
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

> **Important:** `proxy_buffering off` on `/api/chat` is required so streamed
> tokens — and the `meta` routing event that re-themes the UI — reach the
> browser immediately.
>
> `X-Forwarded-For` must be passed through: rate limiting and audit logs
> identify clients by it.

---

## 5. Alternative — bare metal with PM2

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm run db:seed        # first deploy only

pm2 start npm --name bitsol-web -- start
pm2 save && pm2 startup
```

`ecosystem.config.js` (optional):
```js
module.exports = {
  apps: [{
    name: "bitsol-web",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    instances: "max",
    exec_mode: "cluster",
    env: { NODE_ENV: "production", PORT: 3000 },
  }],
};
```

---

## 6. CI/CD (GitHub Actions outline)

`.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx prisma generate
      - run: npm run typecheck
      - run: npm run build
      # Then: build & push a Docker image, or rsync + `docker compose up -d`,
      # or SSH to the server and `git pull && docker compose up -d --build`.
```

Store secrets (`DATABASE_URL`, `ANTHROPIC_API_KEY`, SSH keys) in GitHub
repository secrets — never in the workflow file.

---

## 7. Go-live checklist

**Content — do this before announcing the assistant**

- [ ] Review service pricing in `src/data/marketing/services.ts`. Every figure
      ships as a clearly-labelled placeholder; the assistant presents them as
      indicative and offers a written quotation, but they should still be real.
- [ ] Review course fees and instalment plans in `src/data/institute/courses.ts`.
- [ ] Update phone, WhatsApp, email, address and office hours for **both**
      businesses in `src/lib/brands.ts`. The assistant is instructed never to
      give contact details beyond these values.
- [ ] Re-run `npm run db:seed` to push the changes into the database.
- [ ] Walk the Knowledge Base module (`/admin/knowledge`) for each business and
      confirm every entry is accurate and `PUBLISHED`.

**Security**

- [ ] `JWT_SECRET` is a fresh 48-byte random string.
- [ ] Seeded accounts (`admin@bitsol.local`, `sales@bitsol.local`,
      `admissions@bitsol.local`) have had their passwords changed, or been
      replaced with real staff accounts.
- [ ] Staff who work on only one business have `department` set, so they cannot
      read the other pipeline.
- [ ] `REDIS_URL` is configured so rate limiting is actually enforced.
- [ ] TLS is live and HTTP redirects to HTTPS.

**Smoke test**

- [ ] `/chat` → the welcome screen offers both businesses.
- [ ] Ask a Marketing question → the UI turns blue, answers from Marketing content.
- [ ] Ask an Institute question → the UI turns emerald, answers from course content.
- [ ] Say "I want a course for my company" → the assistant asks which business.
- [ ] Submit a quote request and an admission inquiry; confirm both references
      appear in `/admin/crm/leads` and `/admin/crm/admissions`.
- [ ] Ask to "talk to a human"; confirm a ticket appears in `/admin/support/tickets`.
- [ ] `curl https://your-domain/api/health` returns `"status":"healthy"`.

---

## 8. Backups & operations

- **Database backups:** schedule `pg_dump` (e.g. nightly) with off-site copies.
  ```bash
  docker compose exec db pg_dump -U bitsol bitsol_assistant > backup_$(date +%F).sql
  ```
- **Migrations:** always `prisma migrate deploy` (never `migrate dev`) in prod.
- **Health monitoring:** poll `/api/health`; alert on `503`.
- **Notification delivery:** the app queues rows in `notifications`. Run a worker
  that reads `status = QUEUED` and delivers via SMTP/SMS/WhatsApp, or monitor the
  queue depth at `/admin/notifications`.
- **Log rotation:** ship container logs to your logging stack. Application audit
  history lives in `system_logs` and is visible at `/admin/logs`.
- **Zero-downtime updates:** rebuild `web` while `db`/`redis` keep running.

---

<div align="center">
Designed &amp; Developed by <b>BITSOL MARKETING</b> — https://bitsolmarketing.com
</div>

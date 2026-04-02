# Jessica da Horta — Garden Design Website

Full-stack website for **Jessica da Horta Garden Design**, a Mediterranean landscape and garden design studio based in Portugal.

Live: [jessicadahorta.com](https://jessicadahorta.com)

---

## Features

### Public Site
- **Single-page landing** — Hero, About, Projects gallery, FAQ accordion, Contact forms, Footer
- **Schedule a Visit** — Multi-step form (9 steps) with address-based distance/travel-fee calculator, automatic PDF generation (client + internal versions), and file attachments
- **Contact forms** — General inquiries, pricing requests, and freelance job applications — each sent via Resend API
- **Blog** — Public blog with categories, individual post pages, and SEO-friendly slug routes
- **i18n** — Full Portuguese, English, and Spanish translations
- **Bot protection** — Honeypot fields, timestamp validation (≥ 3 s), and KV-based IP rate limiting on all public form endpoints
- **Cookie consent** — GDPR-compliant banner for essential cookies only, with Terms of Use modal
- **Animated ladybugs** — Four ladybugs land on botanical art, fly between leaf zones, and escape on hover
- **Custom cursor** — Animated GIF cursor replacing the default pointer

### Admin Panel (`/sso`)
- **Authentication** — Secure login with password setup flow and password reset via email
- **Leads management** — View and manage contact/schedule form submissions
- **Blog editor** — Rich text editor (TipTap) with image uploads, categories, and publish/draft workflow
- **Projects** — Project management with task tracking
- **Calendar** — Appointment scheduling and management
- **Prices & Suppliers** — Manage pricing tables and supplier directory

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 7, Vite 5 |
| Styling | Custom CSS (design tokens / CSS variables) |
| Rich text | TipTap editor (admin blog) |
| PDF generation | jsPDF + html2canvas |
| Backend | Cloudflare Pages Functions (serverless) |
| Database | Cloudflare D1 (SQLite) |
| KV storage | Cloudflare KV (rate limiting, prices, suppliers) |
| Email | Resend API |
| Hosting | Cloudflare Pages |

---

## Project Structure

```
├── src/
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles & design tokens
│   ├── components/             # Public site components
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── FAQ.jsx
│   │   ├── Contact.jsx         # 3 contact forms (general/prices/jobs)
│   │   ├── ScheduleVisit.jsx   # 9-step scheduling wizard
│   │   ├── CookieConsent.jsx   # GDPR cookie banner
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Blog.jsx
│   │   └── FakeCursor.jsx
│   ├── pages/                  # Route pages
│   │   ├── BlogPage.jsx
│   │   └── SchedulePage.jsx
│   ├── admin/                  # Admin panel (SSO)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   └── pages/
│   ├── i18n/                   # Translations (PT, EN, ES)
│   │   ├── index.jsx
│   │   ├── pt.js
│   │   ├── en.js
│   │   └── es.js
│   └── utils/
│       └── generatePdf.js      # Client + internal PDF generation
├── functions/                  # Cloudflare Pages Functions (API)
│   ├── _middleware.js
│   ├── _shared/
│   │   ├── adminAuth.js        # JWT auth utilities
│   │   └── botProtection.js    # Honeypot, timestamp, rate limiting
│   └── api/
│       ├── contact.js          # POST /api/contact
│       ├── schedule.js         # POST /api/schedule
│       ├── blog/               # Public blog endpoints
│       └── admin/              # Authenticated admin endpoints
├── migrations/                 # D1 database migrations
├── public/                     # Static assets
├── images/                     # Project images
├── docs/                       # FAQ data, portfolio docs
├── vite.config.js
├── wrangler.toml               # Cloudflare configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (included as dev dependency)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens `http://localhost:5173` with hot reload.

### Build

```bash
npm run build
```

Outputs production bundle to `dist/`.

### Deploy

```bash
npm run deploy
```

Builds and deploys to Cloudflare Pages (production).

---

## Environment Variables

Set these as **secrets** in the Cloudflare Pages dashboard:

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key for sending emails |
| `ADMIN_JWT_SECRET` | Secret for signing admin JWT tokens |
| `ADMIN_EMAIL` | Admin email address for password setup/reset |

Configured in `wrangler.toml` (non-secret):

| Variable | Description |
|----------|-------------|
| `JESSICA_EMAIL` | Contact email for form submissions |

### Bindings

| Binding | Type | Purpose |
|---------|------|---------|
| `DB` | D1 Database | Blog posts, categories |
| `LEADS_KV` | KV Namespace | Rate limiting, lead storage |
| `PRICES_KV` | KV Namespace | Pricing data |
| `SUPPLIERS_KV` | KV Namespace | Supplier directory |

---

## License

See [LICENSE](LICENSE) for details.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Café de la Esquina** template — a static café website paired with a full restaurant CRM, all in vanilla HTML/CSS/JavaScript. No build step, no framework, no package manager needed.

## Running the Project

Open files directly in a browser — no server required for the website. For the CRM, a local server avoids CORS issues with Supabase:

```bash
# Any of these work:
npx serve .
python -m http.server 8080
```

The CRM works entirely offline in **demo mode** (no Supabase needed). Demo accounts are in [crm/js/api.js](crm/js/api.js):

| Email | Password | Role |
|---|---|---|
| admin@demo.com | demo123 | administrador |
| gerente@demo.com | demo123 | gerente |
| recepcion@demo.com | demo123 | recepcionista |
| empleado@demo.com | demo123 | empleado |

## Architecture

### Website (`/`)
- [index.html](index.html) — single-page site with anchored sections: hero, about, menu, gallery, location, contact
- [css/styles.css](css/styles.css) — all styles; mobile-first, uses CSS custom properties only (no utility classes)
- [js/script.js](js/script.js) — sticky header, mobile hamburger, menu tab filtering, lightbox gallery, scroll spy

**External CDN dependencies** (no local copies): Google Fonts (Playfair Display, Cormorant Garamond, Lato), Font Awesome 6.4.2.

**Phone number** is centralized via `data-phone` attribute on `<body>` — `script.js` propagates it to all `wa.me/` and `tel:` links automatically.

### CRM (`/crm`)
- **Entry point**: [crm/index.html](crm/index.html) (login) → [crm/dashboard.html](crm/dashboard.html)
- **Styling**: Bootstrap 5.3.2 (CSS via CDN) + [crm/css/crm.css](crm/css/crm.css)
- **Auth layer**: [crm/js/auth.js](crm/js/auth.js) — role hierarchy `empleado < recepcionista < gerente < administrador`; session stored in `localStorage`; call `Auth.requireAuth()` and `Auth.requireRole('gerente')` at page top
- **Demo data**: [crm/js/data.js](crm/js/data.js) — in-memory arrays (`DEMO_USERS`, `DEMO_CUSTOMERS`, `DEMO_RESERVATIONS`, `DEMO_ORDERS`, `DEMO_INCIDENTS`, `DEMO_MESSAGES`) with no external dependencies
- **API layer**: [crm/js/api.js](crm/js/api.js) — Supabase client config + `DEMO_MODE` flag + `DB` object with all query methods (`getSession`, `login`, `logout`, `getDashboardData`, `getCustomers`, `createCustomer`, etc.); `DEMO_MODE` is `true` when Supabase is not configured
- **Shell component**: [crm/js/crm-shell.js](crm/js/crm-shell.js) — `<crm-shell>` Web Component (Light DOM) that renders the sidebar nav and topbar; accepts a `page-title` attribute and a `slot="topbar-actions"` child for per-page action buttons
- **Utilities**: [crm/js/utils.js](crm/js/utils.js) — `showToast()`, date/currency formatters, status badge generators
- **Page scripts**: [crm/js/pages/](crm/js/pages/) — one script per CRM page (`dashboard.js`, `customers.js`, `reservations.js`, `orders.js`, `incidents.js`, `messages.js`)
- **Database schema**: [crm/sql/schema.sql](crm/sql/schema.sql) — PostgreSQL for Supabase (UUID PKs, multi-tenant via `restaurant_id`)

### CRM Pages
Each page is standalone HTML. All pages share the same `<crm-shell>` Web Component for the sidebar and topbar. Scripts loaded at bottom of each page in order: `data.js` → `api.js` → `auth.js` → `utils.js` → `crm-shell.js` → `pages/[page].js`.

**`<crm-shell>` usage pattern:**
```html
<crm-shell page-title="Título de la página">
  <div slot="topbar-actions">
    <!-- Botones de acción opcionales para el topbar -->
  </div>
  <main class="crm-content">
    <!-- Contenido de la página -->
  </main>
</crm-shell>

<!-- Modales Bootstrap FUERA de <crm-shell> para que Bootstrap los encuentre -->
<div class="modal fade" id="modal-example">...</div>
```

## Design System

### Website Color Palette (CSS custom properties in `:root`)
- `--clr-primary: #A06A3F` — caramelo, used for CTAs and accents
- `--clr-primary-dark: #6F4A2A` — moca, hover states
- `--clr-dark: #2B2018` — espresso, header and main text
- `--clr-bg: #FAF4EC` — crema latte, page backgrounds

### Typography
- Headings: `--font-heading` (Playfair Display)
- Display/hero text: `--font-display` (Cormorant Garamond)
- Body: `--font-body` (Lato)

### Transitions
Use `var(--t)` for transitions — it covers color, background, border, transform, box-shadow, opacity. Never use `transition: all`.

## Key Conventions

- All Spanish — UI copy, variable comments, and commit messages are in Spanish.
- The website has no JavaScript dependencies; keep it that way.
- CRM pages must call `Auth.requireAuth()` (or `Auth.requireRole()`) as the first script in `<body>` — this redirects unauthenticated users before rendering.
- Demo data mutations (create/edit/delete in demo mode) only update the in-memory arrays in `data.js`; changes are lost on page reload by design.
- To connect a real Supabase project, update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in [crm/js/api.js](crm/js/api.js) and load the Supabase JS SDK via CDN in each CRM page.

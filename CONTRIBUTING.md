# Contributing to Jessica da Horta Website

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Run** the dev server: `npm run dev`
5. Create a **feature branch**: `git checkout -b feat/your-feature`

## Development Setup

### Prerequisites

- Node.js ≥ 18
- npm
- A Cloudflare account (for testing Functions locally)

### Local Development

```bash
npm run dev          # Start Vite dev server at localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
```

### Project Structure

- `src/` — React frontend (components, pages, i18n, utils)
- `src/admin/` — Admin panel (SSO)
- `functions/` — Cloudflare Pages Functions (API endpoints)
- `migrations/` — D1 database migrations
- `public/` — Static assets

## Making Changes

### Code Style

- Use functional React components with hooks
- Follow existing naming conventions (camelCase for variables, PascalCase for components)
- Keep components focused — one responsibility per file
- Use the existing i18n system for any user-facing text (PT, EN, ES)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new garden style option to schedule form
fix: correct PDF layout on mobile devices
docs: update README with new environment variables
chore: update dependencies
```

### Translations

When adding user-facing text, add translations to all three language files:

- `src/i18n/pt.js` — Portuguese (primary)
- `src/i18n/en.js` — English
- `src/i18n/es.js` — Spanish

## Submitting Changes

1. Ensure the build passes: `npm run build`
2. Test your changes locally with `npm run dev`
3. Commit your changes with a descriptive message
4. Push to your fork and open a **Pull Request**
5. Describe what your PR does and link any related issues

## Reporting Bugs

Open an [issue](https://github.com/fredsmeds/jessica_da_horta_web/issues) with:

- A clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Browser and device info (if frontend-related)

## Questions?

Feel free to open an issue for any questions about the codebase.

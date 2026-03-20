# Cloud Service Monitor Dashboard

React + Material UI + mocked GraphQL (static in-memory) implementation for the assessment:

- Config-driven UI rendering (`src/config/dashboardConfig.ts`)
- Services tab: health overview cards with skeleton loading
- Incidents tab: config-driven filters, paginated table, role-based actions, and an incident detail side panel
- Notes: controlled auto-save after 2 seconds of inactivity (no explicit Save button)
- Auto-refresh polling (30s) toggle in the header with proper cleanup

## Getting started

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Build

```bash
npm run build
```

## Deployment (free options)

This project is compatible with free React hosting (Vercel / Netlify / Render) using the default `npm run build` + `dist/` output.


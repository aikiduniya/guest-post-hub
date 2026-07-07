# Convert to static SPA build (dist/index.html + dist/assets/)

## Goal
Current project is TanStack Start (SSR) — it builds a Cloudflare Worker (`.output/server/*` + `.output/public/*`), not a plain `index.html`. Convert it to a **client-only Vite + React SPA** so `bun run build` produces:

```
dist/
  index.html
  assets/
    index-[hash].js
    index-[hash].css
    ...
```

This is what any static host (Netlify, Vercel static, Cloudflare Pages, cPanel, S3, Nginx) expects.

## What changes

### 1. Build tooling
- Replace `@lovable.dev/vite-tanstack-config` with a standard Vite + React setup (`@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-tsconfig-paths`).
- New `vite.config.ts` with `build.outDir = "dist"`.
- Remove the TanStack Start server entry (`src/server.ts`, `src/start.ts`), Nitro output, and `src/lib/error-page.ts` / `error-capture.ts`.

### 2. Routing
- Keep TanStack Router but switch to **client-only** mode (no SSR, no `createFileRoute` loaders that need a server).
- `src/router.tsx` mounts the router in `src/main.tsx` against `<div id="root">` in a new `index.html`.
- Delete `src/routes/__root.tsx` `shellComponent` (html/head/body) — those move into `index.html`. Root route becomes a normal layout with `<Outlet />`.
- Head metadata (title/meta/og) moves to a client-side solution: either react-helmet or per-route `useEffect` that sets `document.title` / meta tags.

### 3. Server functions → direct Supabase calls
All `createServerFn` functions get rewritten to call Supabase from the browser using the publishable key + RLS:
- `src/lib/user.functions.ts` (getMyOrders, etc.) → direct `supabase.from(...)` calls in components/hooks.
- `src/lib/admin.functions.ts` (admin CRUD) → direct Supabase calls; admin gating relies on RLS policies + `has_role()`.
- `src/lib/public.functions.ts` → direct Supabase reads.
- Delete `auth-middleware.ts`, `auth-attacher.ts`, `client.server.ts` (service-role client can't exist in a SPA — anything that truly needed it must move to a Supabase Edge Function; from what I've seen the app doesn't rely on service-role for user flows).

### 4. Auth gate
- `src/routes/_authenticated/route.tsx` becomes a client-side gate: read session from `supabase.auth.getSession()` and redirect to `/auth` when missing (already close to this pattern).

### 5. package.json
- `"build": "vite build"` → outputs `dist/`.
- `"dev": "vite"`.
- Remove `@tanstack/react-start`, `nitro`, `h3`, TanStack Start Vite plugin, `@lovable.dev/vite-tanstack-config`.
- Keep `@tanstack/react-router` (still used for routing) and its Vite plugin for file-based routes.

## What stays the same
- All pages, components, styles, Tailwind v4 setup, shadcn components, Supabase schema and RLS, admin UI, sites listing, branding/logo, etc.
- File-based routes under `src/routes/*` (naming convention unchanged).

## Impact / trade-offs
- **Lovable's own publish flow**: still works — Lovable can serve `dist/` too, but if you want it deployed as a Worker on `*.lovable.app`, this change moves you off that runtime. Use only if you're deploying to a static host.
- **SEO**: no SSR means search engines get an empty HTML shell + JS. Fine for app-like sites, worse for content-heavy marketing pages. Given this project is mostly an admin + gated dashboard with a small marketing surface, acceptable.
- **Auth-protected data loading** runs in the browser after hydration — a brief flash before redirect on protected pages, normal SPA behaviour.
- **Cannot use service-role key** anywhere in the frontend (correct — it never should have been). Any admin action that truly required bypassing RLS would need a Supabase Edge Function; current admin actions look RLS-compatible.

## Deliverable
After the refactor, running `bun run build` produces `dist/index.html` and `dist/assets/*` that you can upload to any static host.

---

**Confirm to proceed?** This touches ~15–20 files and removes ~5. Once you approve I'll do it in one pass.
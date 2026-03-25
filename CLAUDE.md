# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fabricante Directo** is a B2B e-commerce React Native (Expo) app connecting manufacturers (fabricantes) with wholesalers (mayoristas). It's distributed exclusively on Google Play Store.

## Development Commands

```bash
npx expo start          # Start Expo dev server
npx expo start --android  # Open on Android emulator directly
npm run lint            # Run ESLint

# EAS builds (requires EAS CLI + authentication)
npm run build:preview   # Build APK for internal testing
npm run build:android   # Build production AAB for Play Store
npm run build:submit    # Build + submit to Google Play in one step
```

There are no tests in this project.

## Architecture

### Routing
File-based routing via **Expo Router** (similar to Next.js). Route groups in `app/`:
- `(auth)/` — login, registration, password recovery
- `(onboarding)/` — role selection, document upload/verification
- `(tabs)/` — main app for wholesalers (home, tienda, carrito, favoritos, cuenta)
- `(dashboard)/` — manufacturer features (products, orders, users)

Root layout at `app/_layout.tsx` wraps everything in Redux store + `AuthContext`.

### State Management
Redux Toolkit with **redux-persist** (AsyncStorage). Store configured in `store/index.ts` with 12 slices in `store/slices/`:
`auth`, `user`, `product`, `cart`, `order`, `manufacturer`, `wholesaler`, `colors`, `sizes`, `images`, `favorites`, `reviews`.

Not all slices are persisted — check the whitelist in `store/index.ts` when working with persistence behavior.

### API Layer
`services/axiosConfig.ts` defines **16+ Axios instances**, one per resource type (e.g., `manufacturerInstance`, `productInstance`, `cartInstance`, `orderInstance`). Each instance targets a specific microservice.

API base URLs switch between dev (local IP `192.168.1.43`) and prod (`*.fabricantedirecto.com`) via `constants/ApiConfig.ts`. Check this file when switching environments.

### Auth Flow
`AuthContext` (`contexts/AuthContext.tsx`) handles session state and drives routing decisions (unauthenticated → auth screens, no role → onboarding, etc.). Uses `useAuth` hook to consume it. Google Sign-In is configured in `config/googleSignIn.ts`.

### Styling
**NativeWind** (Tailwind CSS for React Native). Custom theme in `tailwind.config.js`:
- Primary: Navy blue (`#021344`)
- Secondary: Orange (`#f86f1a`)
- Font: Montserrat (5 weights, defined as custom font names)

Global CSS entry point: `app/global.css`. Babel is configured with `nativewind/babel`.

### Path Aliases
`@/*` resolves to the project root (configured in `tsconfig.json` and `metro.config.js`).

## Key Files

| File | Purpose |
|------|---------|
| `constants/ApiConfig.ts` | API base URLs (dev/prod toggle) |
| `services/axiosConfig.ts` | All Axios instances |
| `contexts/AuthContext.tsx` | Auth state + routing logic |
| `store/index.ts` | Redux store + persist config |
| `tailwind.config.js` | Design tokens (colors, fonts) |
| `app.json` | Expo app config, permissions, plugins |
| `eas.json` | Build profiles (development/preview/production) |

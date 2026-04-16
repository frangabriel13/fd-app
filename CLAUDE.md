# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fabricante Directo** is a B2B e-commerce React Native (Expo) app connecting manufacturers (fabricantes) with wholesalers (mayoristas). Distributed exclusively on Google Play Store.

## Development Commands

```bash
npx expo start                    # Start Expo dev server
npx expo start --android          # Open on Android emulator directly
npm run android                   # Run native Android build (uses community autolinking)
npm run lint                      # Run ESLint

# EAS builds (requires EAS CLI + authentication)
npm run build:preview             # Build APK for internal testing
npm run build:android             # Build production AAB for Play Store
npm run build:submit              # Build + submit to Google Play in one step
npm run submit:android            # Submit existing build to Google Play
```

There are no tests in this project.

## Architecture

### Routing

File-based routing via **Expo Router**. Route groups in `app/`:
- `(auth)/` — login, registration, password recovery
- `(onboarding)/` — role selection, document upload/verification
- `(tabs)/` — main app for wholesalers (home, tienda, carrito, favoritos, cuenta)
- `(dashboard)/` — manufacturer features (products, orders, users)

Root layout at `app/_layout.tsx` wraps providers in this order:
```
<Provider store>
  <PersistGate>
    <NotificationSetup />       ← Firebase FCM setup + background handler
    <AuthProvider>
      <ThemeProvider>
        <Stack />               ← Expo Router navigation
      </ThemeProvider>
    </AuthProvider>
  </PersistGate>
</Provider>
```

### State Management

Redux Toolkit + **redux-persist** (AsyncStorage). Store in `store/index.ts`, slices in `store/slices/`:

| Slice | Purpose | Persisted |
|---|---|---|
| `auth` | Token, authentication state | Yes |
| `user` | Current user profile, role, subscriptions, followers | Yes |
| `product` | Products, pagination, filters (search state excluded via transform) | Yes* |
| `cart` | Cart items organized by manufacturer ID | Yes |
| `order` | Order creation and retrieval | Yes |
| `manufacturer` | Manufacturer details, reviews, followers | Yes |
| `wholesaler` | Wholesaler profile and creation state | Yes |
| `colors` | Available colors for product creation | Yes |
| `sizes` | Available sizes grouped by type | Yes |
| `images` | Image uploads with progress tracking | Yes |
| `favorites` | Favorite products | Yes |
| `reviews` | Reviews for manufacturers | Yes |
| `notifications` | App notifications | **No** |

\* Product slice uses a custom transform that excludes `searchLoading` and `searchResults` from persistence to prevent stale loading state on relaunch.

Use typed hooks from `hooks/redux/index.ts`: `useAppDispatch` and `useAppSelector`.

### API Layer

`services/axiosConfig.ts` defines **16 Axios instances**, one per resource type. All authenticated instances automatically attach Bearer tokens (from Redux store, falling back to AsyncStorage) and retry on 401 via `refreshTokenService()`.

**Authenticated instances** (auto-add Bearer token):

| Instance | Microservice |
|---|---|
| `manufacturerInstance` | :3001/manufacturers |
| `userInstance` | :3001/users |
| `wholesalerInstance` | :3001/wholesalers |
| `orderInstance` | :3001/orders |
| `reviewInstance` | :3001/reviews |
| `favoriteInstance` | :3001/favorites |
| `adminInstance` | :3001/admin |
| `cartInstance` | :3001/cart |
| `notificationInstance` | :3001/notifications |
| `productInstance` | :3000/products |
| `videoInstance` | :3000/videos |
| `imageInstance` | :3000/images |
| `packInstance` | :3000/packs |

**Unauthenticated instances** (no token):

| Instance | Microservice |
|---|---|
| `authInstance` | :3001/auth |
| `categoryInstance` | :3000/categories |
| `colorInstance` | :3000/colors |
| `genderInstance` | :3000/genders |
| `sizeInstance` | :3000/sizes |

### API Environment Config

`constants/ApiConfig.ts` uses the `__DEV__` build-time flag:
- **Dev (mobile):** hardcoded LAN IP `192.168.1.43` — **update this before local development**
- **Dev (web):** `localhost`
- **Prod:** `nodeuser.fabricantedirecto.com:3001` and `nodeproduct.fabricantedirecto.com:3000`

All URLs include the `/api` path prefix.

### Auth Flow

`AuthContext` (`contexts/AuthContext.tsx`) drives all routing decisions based on Redux state (`auth.token`, `user.myUser`). On mount it waits ~100ms for redux-persist hydration before calling `fetchAuthUser()`.

Routing logic:
1. No token → `/(auth)/login`
2. Token + no role → `/(onboarding)/rol`
3. Manufacturer with `pending` or `not_started` verification → `/(onboarding)/validar-documentos`
4. Authenticated with role → tabs/dashboard

Consume via `useAuthContext()` → `{ isLoading, isAuthenticated, userRole }`.

### Contexts

| Context | Purpose |
|---|---|
| `AuthContext` | Session state + routing decisions |
| `CartAnimationContext` | Add-to-cart animation state |
| `ModalContext` | Global success modal |

### Custom Hooks

All in `hooks/`:

| Hook | Purpose |
|---|---|
| `useAuth()` | Auth state + routing logic |
| `useCart()` | Cart operations (add, update, remove, fetch) |
| `useCartAnimation()` | Cart animation state |
| `useCartBadge()` | Cart item count for badge display |
| `useColorScheme()` | Platform-specific theme detection |
| `useColors()` | Fetch colors from Redux |
| `useGoogleSignIn()` | Google Sign-In flow |
| `useNotifications()` | Firebase Cloud Messaging setup |
| `useRefresh()` | Pull-to-refresh logic |
| `useShop()` | Shop listing, filtering, pagination |
| `useSizes()` | Fetch sizes from Redux |
| `useThemeColor()` | Theme color utilities |

### Styling

**NativeWind** (Tailwind CSS for React Native). Custom theme in `tailwind.config.js`:
- Primary: Navy blue (`#021344`)
- Secondary: Orange (`#f86f1a`)
- Font: Montserrat (Black, Bold, Medium, Regular, Light — loaded in root layout)

Global CSS entry point: `app/global.css`. Babel is configured with `nativewind/babel`.

### Component Directory Structure

`components/` is organized by feature domain:
- `ui/` — reusable primitives
- `header/` — top header (logo, search, notifications, search dropdown)
- `headers/` — back-navigation headers
- `home/` — home page sections
- `shop/` — shop listings
- `store/` — manufacturer store pages
- `createProduct/` — product creation forms (colors, images, sizes, video)
- `detailProduct/` — product detail view with gallery
- `cart/` — cart display, order unification, confirmation
- `tables/` — tabular data (orders, products)
- `fabricantes/` — manufacturer listings and skeletons
- `documents/` — document upload/verification cards
- `register/` — registration flow
- `favorites/` — favorite product cards
- `account/` — account menu and live sections
- `modals/` — modal components
- `slider/` — carousels

See `examples/` for Redux and Axios usage patterns aimed at new developers.

### Path Aliases

`@/*` resolves to the project root (configured in `tsconfig.json` and `metro.config.js`).

## Key Files

| File | Purpose |
|---|---|
| `constants/ApiConfig.ts` | API base URLs — update LAN IP for local dev |
| `services/axiosConfig.ts` | All Axios instances + token interceptors |
| `contexts/AuthContext.tsx` | Auth state + routing logic |
| `store/index.ts` | Redux store + persist config + whitelist |
| `tailwind.config.js` | Design tokens (colors, fonts) |
| `app.json` | Expo config, Android permissions, plugins |
| `eas.json` | Build profiles (development/preview/production) |
| `config/googleSignIn.ts` | Google Sign-In configuration |

# Reporte Pre-Release — Fabricante Directo

**Fecha:** 2026-04-21
**App:** Fabricante Directo (fd-app)
**Versión analizada:** 1.0.3 (versionCode 2)
**Bundle ID:** `com.fabricantedirecto.fdapp`
**Destino:** Google Play Store — Prueba Cerrada (Closed Beta)
**Stack:** Expo SDK 53 · React Native 0.79.6 · React 19 · Hermes · New Architecture

---

## 1. Resumen ejecutivo

### Semáforo global

| Área | Estado | Observación breve |
|---|---|---|
| Arquitectura | 🟢 Buena | Estructura por features clara, Redux bien tipado, rutas por grupos de Expo Router coherentes. |
| Calidad de código | 🟡 Aceptable con deuda | 162 `console.*` en 31 archivos, 112 `any` en 39 archivos, archivos de ejemplo en bundle. |
| Performance | 🟡 Mejorable | `@shopify/flash-list` instalado pero nunca usado; 11 `ProductSlider` apilados en home; mezcla `expo-image` / `Image`. |
| Seguridad | 🔴 Crítico | Keystore de debug en release, JWT en `AsyncStorage` plano, `android:allowBackup=true`, logs de tokens. |
| Manejo de errores | 🔴 Bloqueante | **Crash garantizado en `favoritos.tsx`** por `useEffect` no importado; no hay `ErrorBoundary` ni `NetInfo`. |
| Dependencias | 🟡 Limpieza necesaria | `@types/react-redux` obsoleto, `flash-list` sin usar, falta `babel-plugin-transform-remove-console`. |
| Compatibilidad | 🟡 Revisar | `supportsTablet: true` iOS sin layouts tablet, permiso `SYSTEM_ALERT_WINDOW` en manifest pero no en `app.json`. |
| Accesibilidad | 🔴 Débil | Sin `accessibilityLabel` sistemáticos, botones icónicos sin rol/nombre, contraste no validado. |
| UX | 🟡 Aceptable | Pantalla 404 aún en inglés, mensajes de error genéricos con `Alert`, sin feedback offline. |
| Config release | 🔴 Bloqueante | Release firmado con `debug.keystore`, ProGuard/minify OFF, `EX_DEV_CLIENT_NETWORK_INSPECTOR=true`. |
| Testing | 🔴 Inexistente | Sin framework de tests, sin e2e, sin CI. |

### Veredicto

> 🔴 **NO está listo para publicar en Closed Beta** tal como se encuentra hoy.

Se encontraron **3 bloqueantes críticos** que impiden la publicación:

1. Crash 100% reproducible en la pestaña **Favoritos** para mayoristas (falta import de `useEffect`).
2. El **build de release se firma con `debug.keystore`** — no se puede subir a Google Play con ese artefacto, y aunque se pudiera, arruinaría futuras actualizaciones del track.
3. **ProGuard/minify desactivado** en release → bundle más grande, sin ofuscación, símbolos expuestos.

Tras resolver los 3 bloqueantes y los 5 "must-fix" (ver §14), la app puede entrar a Closed Beta con riesgo controlado. Las observaciones de seguridad media y de UX/accesibilidad son aceptables para un track cerrado de testers, pero deberían resolverse antes del lanzamiento público.

---

## 2. Arquitectura y estructura

### 2.1 Routing (Expo Router file-based)

Organización por grupos:

- `app/(auth)/` — login, registro, recuperación, verificación.
- `app/(onboarding)/` — selección de rol, carga de documentos, validación.
- `app/(tabs)/` — experiencia para mayoristas (home, tienda, carrito, favoritos, cuenta).
- `app/(dashboard)/` — experiencia para fabricantes (productos, órdenes, usuarios).
- `app/_layout.tsx` monta la cadena de providers correctamente.

✔ Buena separación. ✔ Layouts bien anidados.

### 2.2 Stack de providers (`app/_layout.tsx`)

```
<Provider store>
  <PersistGate>
    <NotificationSetup />
    <AuthProvider>
      <ThemeProvider>
        <Stack />
```

✔ Orden correcto: persistencia hidratada antes de autenticación, tema antes de navegación.
⚠ `NotificationSetup` se renderiza antes de `AuthProvider` — el handler de mensajes en background (`app/_layout.tsx:14`) se registra sin saber si hay usuario.

### 2.3 State (Redux Toolkit + redux-persist)

14 slices, todos persistidos salvo `notifications`. Transform custom en `product` para excluir `searchLoading` / `searchResults` (bien pensado para evitar loaders "pegados" tras relaunch).

✔ Tipado sólido (`RootState`, `AppDispatch`, hooks tipados en `hooks/redux/index.ts`).
⚠ No se documenta migración entre versiones de estado persistido; si cambia la shape de un slice los usuarios existentes pueden romperse.

### 2.4 Capa de API (`services/axiosConfig.ts`)

16 instancias axios (12 con interceptor de Bearer + retry 401, 4 sin auth). Dynamic import `await import('@/store')` por cada request para romper dependencia circular → funciona pero introduce overhead.

⚠ El fallback a `AsyncStorage` si el store está vacío es correcto, pero cualquier falla del store hace log crudo en producción.

### 2.5 Contextos

`AuthContext`, `CartAnimationContext`, `ModalContext`. `AuthContext` concentra la lógica de routing — ver §6.2 para problemas de carrera.

---

## 3. Calidad del código

### 3.1 Logs en producción

**162 llamadas `console.log`/`warn`/`error` en 31 archivos.** Sin `babel-plugin-transform-remove-console` ni wrapper propio, todos ejecutan en release.

Ejemplos representativos:
- `services/axiosConfig.ts:15,19,34,147,156,169` — errores y URLs de API.
- `services/authService.ts` — token y flujo de auth.
- `hooks/useGoogleSignIn.ts:25` — `console.log('Usuario autenticado:', userInfo)` → **filtra `idToken`, email y nombre al logcat**.
- `app/(tabs)/producto/[id].tsx:95` — imprime `currentProduct` completo en cada navegación.
- `app/(dashboard)/subir-producto/detalle-producto.tsx:195-206` — bloque "=== DEBUG COMPLETO ===" con 25 `console.log`.
- `services/notificationService.ts:34` — `"🔔 FCM Token registrado"` en cada arranque.

### 3.2 `any` explícitos

**112 `any` en 39 archivos.** Inspecciones puntuales:
- `hooks/useGoogleSignIn.ts:28,64` — `error: any`.
- `app/(auth)/registro.tsx:86` — `catch (error: any)`.
- Slices de Redux con payloads tipados como `any` en varios `rejected` handlers.

No es bloqueante, pero debilita las garantías de TS.

### 3.3 Código muerto / archivos de ejemplo

- `components/shop/Shop.tsx` — stub de 17 líneas sin uso real.
- `components/examples/ReduxExample.tsx` y `AxiosReduxExample.tsx` — **archivos didácticos shippeados en el bundle**.
- `hooks/useAuth.ts` — hook legacy con `console.log` comentados (`hooks/useAuth.ts:9-12`); `useAuthContext` es el reemplazo de facto.

### 3.4 Literales de UI

`app/+not-found.tsx` sigue en inglés ("This screen does not exist", "Go to home screen!") — el resto de la app está en español.

### 3.5 Lint

`eslint.config.js` solo extiende `expo-config`. No hay reglas custom (ni `no-console`, ni `no-unused-vars` estricto, ni `react-hooks/exhaustive-deps` elevado a error). No hay pipeline que corra lint en pre-commit o CI.

### 3.6 Comentarios

✔ Consistentes en español, alineado con preferencia del usuario.
⚠ Varios comentarios "TODO" / "DEBUG" que deberían limpiarse antes del build.

---

## 4. Performance

### 4.1 Listas

- **`@shopify/flash-list` 1.7.6 está instalado pero NUNCA importado.** Todas las listas usan `FlatList` de RN (home, tienda, carrito, favoritos, órdenes, usuarios).
- `app/(tabs)/index.tsx:57-72` — 11 `<ProductSlider>` apilados en un único `ScrollView`; cada slider contiene una `FlatList` horizontal. No hay lazy loading ni virtualización del contenedor exterior. Primer render costoso, especialmente en gama baja Android.
- `components/home/ProductSlider.tsx:78-83` — `new Intl.NumberFormat(...)` se crea dentro de `ProductCard` en cada render. Hoistear al módulo (regla `js-hoist-intl`).

### 4.2 Imágenes

- **Uso mixto**: `expo-image` en 13 archivos, `react-native Image` en 6 (`components/createProduct/SelectImages.tsx:8`, `components/cart/DetailCart.tsx:1`, entre otros).
- No se usa `Galeria` para lightboxes (regla `ui-image-gallery`). La galería de detalle de producto podría beneficiarse.
- `components/createProduct/SelectImages.tsx` limita a 3 imágenes con `quality: 0.8` sin compresión adicional.

### 4.3 Pressables

- Varias `TouchableOpacity` donde la guía sugiere `Pressable` (regla `ui-pressable`). Ejemplo: `app/(auth)/registro.tsx:128,147,181`.

### 4.4 Animaciones

- `Reanimated` usado en varios skeletons — correcto.
- `app/(tabs)/favoritos.tsx:28` usa `useSharedValue` dentro de `SkeletonCard` — se recrea por cada item; aceptable pero podría hoistearse si las listas crecen.

### 4.5 Persistencia

- `redux-persist` persiste 13 slices. No hay tamaño máximo ni migración definida. Si un slice crece mucho (p.ej. `product` con caché grande) el tiempo de hidratación aumentará perceptiblemente.

### 4.6 Bundle

- ProGuard/minify OFF (`android/app/build.gradle:70,116`) → JS intacto, código Java sin shrinking. Tamaño del APK/AAB más grande e inspección trivial.
- `enableBundleCompression` default (false) — se puede activar.

---

## 5. Seguridad

### 5.1 🔴 Firma de release con keystore de debug

**`android/app/build.gradle:111-119`**

```gradle
release {
    signingConfig signingConfigs.debug   // ← línea 114
    ...
    minifyEnabled enableProguardInReleaseBuilds   // ← false por default
}
```

- Google Play **rechaza artefactos firmados con la clave de debug**.
- Incluso si se subiera (p.ej. usando EAS con upload key distinta), quedaría un keystore comprometido como de firma de la app.
- Clave y contraseña hardcoded en el repo: `storePassword 'android'` (línea 102), `keyPassword 'android'` (línea 104). Debe mover fuera de control de versión y usar un keystore de producción vía EAS secrets o `gradle.properties` local.

### 5.2 🔴 ProGuard / minify desactivado

`android/app/build.gradle:70` — `enableProguardInReleaseBuilds = false` (propagado a `minifyEnabled`). Sin minify:
- Símbolos y strings de Java legibles.
- Sin shrinking de recursos.
- Bundle más grande, más ancho de banda en Closed Beta.

### 5.3 🟠 JWT en `AsyncStorage` sin cifrar

- `services/authService.ts:52` — `AsyncStorage.setItem('token', ...)`.
- `store/slices/authSlice.ts:44,76,93` — token persistido en el slice persistido.
- `expo-secure-store` no está instalado.
- En Android con `allowBackup=true` (ver §5.4) el token podría terminar en backups de Google Drive.

**Recomendación:** migrar `token` y `refreshToken` a `expo-secure-store`, excluir el campo `token` del `whitelist` de redux-persist o añadir un transform de cifrado.

### 5.4 🟠 `android:allowBackup="true"`

`android/app/src/main/AndroidManifest.xml:18` — Android auto-backup está habilitado. En combinación con tokens en `AsyncStorage`, cualquier backup de Google Drive puede contener credenciales de usuarios. Recomendado `allowBackup="false"` o definir `<full-backup-content>` excluyendo el storage de tokens.

### 5.5 🟠 Logs sensibles

- `hooks/useGoogleSignIn.ts:25` — imprime `idToken`, email y nombre en logcat.
- `store/slices/authSlice.ts` varios `console.error` en el `catch` del `googleLogin` thunk.
- `services/axiosConfig.ts:147` — loggea todas las URLs + status de error.

### 5.6 🟡 Secretos y claves hardcoded

- `config/googleSignIn.ts:7` — `webClientId` embebido (`378911157109-...apps.googleusercontent.com`).
- `utils/whatsapp.ts:3` — número comercial embebido (`5491130415773`).
- `constants/ApiConfig.ts:16` — IP LAN `192.168.1.43` para dev.
- `google-services.json` versionado en el repo (es habitual, pero conviene limitar restricciones de API en Google Cloud Console).

No son secretos de alto impacto per se, pero el patrón debería migrarse a `expo-constants` + `app.config.js` con variables de entorno para facilitar rotación.

### 5.7 🟡 `SYSTEM_ALERT_WINDOW`

`android/app/src/main/AndroidManifest.xml:8` declara `SYSTEM_ALERT_WINDOW` pero **no aparece en `app.json > android.permissions`**. Inconsistencia de build. Si realmente no se usa, quitarlo; si se usa, declararlo en `app.json`.

### 5.8 🟡 Inspector de red en builds

`android/gradle.properties:53` — `EX_DEV_CLIENT_NETWORK_INSPECTOR=true` habilita el inspector incluso en builds no-debug en algunos escenarios. Recomendado poner `false` para `production`.

### 5.9 🟡 Refresh token retry

`services/axiosConfig.ts` reintenta una vez en 401. No hay rate-limit ni back-off; si el backend devuelve 401 por otra razón (token revocado) puede entrar en loops cortos.

---

## 6. Manejo de errores

### 6.1 🔴 Crash garantizado en Favoritos

**`app/(tabs)/favoritos.tsx:1,30`**

```ts
import { useCallback } from 'react';      // ← solo useCallback
...
useEffect(() => {                          // ← línea 30: useEffect SIN importar
  opacity.value = withRepeat(...);
}, [opacity]);
```

→ `ReferenceError: useEffect is not defined` al montar `SkeletonCard` la primera vez que un mayorista abre la pestaña Favoritos en estado de loading. **Esto tumba la pantalla y deja un crash visible en Play Console**. Bloqueante absoluto.

Fix: `import { useCallback, useEffect } from 'react';`

### 6.2 🟠 Carrera en hidratación de auth

`contexts/AuthContext.tsx:28,41` — se usa `setTimeout(..., 100)` como espera arbitraria a que `redux-persist` hidrate antes de `fetchAuthUser()`. En dispositivos lentos puede quedar corto, en rápidos es tiempo perdido. El patrón correcto es escuchar `persistor.subscribe` o usar `onBeforeLift` en `PersistGate`.

### 6.3 🔴 Sin `ErrorBoundary`

No existe ningún componente de clase con `componentDidCatch` ni `getDerivedStateFromError`. Cualquier excepción en render no controlada cierra la pantalla (o la app, en RN con Hermes en algunos casos).

**Recomendación:** envolver `<Stack />` en `app/_layout.tsx` con un `ErrorBoundary` que muestre pantalla de fallback y envíe telemetría (Sentry/Crashlytics).

### 6.4 🟠 Sin detección offline

No se usa `@react-native-community/netinfo` ni ninguna librería equivalente. Cualquier llamada API en modo avión muestra un `Alert` genérico o un error técnico. Para Closed Beta aceptable; para público es básico.

### 6.5 🟡 Patrón `try/catch → console.error` ubicuo

La mayoría de thunks y hooks siguen el patrón:
```ts
try { ... } catch (e: any) { console.error('...', e); }
```
Sin feedback al usuario más allá de un `Alert` ocasional. Centralizar en un toast o un reducer de notificaciones.

### 6.6 🟡 `Alert.alert` para mensajes de negocio

`app/(tabs)/producto/[id].tsx:55-59` — usa `Alert` nativo para "Iniciá sesión como mayorista". Es funcional pero inconsistente con el sistema de diseño.

### 6.7 🟡 Sin Crashlytics / Sentry

No hay SDK de crash reporting. En Closed Beta es perdonable si se confía en los crash reports de Play Console, pero se pierde contexto (breadcrumbs, redux state) y errores JS no fatales.

---

## 7. Dependencias

### 7.1 Versiones principales

- Expo 53 — actual.
- React Native 0.79.6 — actual para SDK 53.
- React 19 — actual.
- `redux-persist` 6.0.0 — estable, no mantenido activamente (considerar alternativas a largo plazo).
- `@shopify/flash-list` 1.7.6 — **instalado, jamás importado**. Es deuda que penaliza performance. Migrar al menos las listas grandes (home, tienda, favoritos, órdenes).
- `@types/react-redux` — marcado como **deprecated** en npm desde que `react-redux` publica sus propios tipos. Quitar.

### 7.2 Firebase / Google

- `@react-native-firebase/app` + `messaging` — ok.
- `@react-native-google-signin/google-signin` — ok.
- `google-services.json` contiene `project_number: 588562315509`, `project_id: fabricante-directo-853ea`.

### 7.3 Multimedia

- `expo-image`, `expo-av`, `expo-image-picker`, `expo-file-system`. Bien, pero uso inconsistente (ver §4.2).

### 7.4 Seguridad

- **Falta** `expo-secure-store` — necesario para almacenar tokens.
- Falta `@react-native-community/netinfo` (opcional pero recomendado).

### 7.5 Build

- Sin `babel-plugin-transform-remove-console` para eliminar `console.*` en producción.

### 7.6 Auditoría

- No hay evidencia de `npm audit` reciente. Ejecutar antes del build.

---

## 8. Compatibilidad

### 8.1 Android

- `minSdkVersion`, `targetSdkVersion`, `compileSdkVersion` vienen de `rootProject.ext.*` (Expo maneja). Verificar que `targetSdkVersion` cumpla con el requisito vigente de Google Play (actualmente 34 mínimo, 35 desde agosto 2026).
- `newArchEnabled: true` (`app.json`) — ok para SDK 53, pero monitorear warnings de libs que no estén listas.
- Orientación `portrait` — ok para app B2B.
- `expo.modules.updates.ENABLED=false` (`AndroidManifest.xml:19`) — OTA explícitamente deshabilitado, coherente con la estrategia de solo Play Store. Documentarlo.
- Deep links: esquemas `fdapp` y `exp+fd-app` (`AndroidManifest.xml:31-32`). `exp+fd-app` es residuo de Expo Go; quitarlo en producción.

### 8.2 iOS

- `supportsTablet: true` en `app.json` pero **no hay layouts tablet**. O se desactiva, o se valida experiencia en iPad. Para Closed Beta Android-only, quitar.
- `bundleIdentifier` no definido en `app.json` — si en algún momento se compila para iOS fallará.

### 8.3 Permisos

Declarados en `app.json`: `CAMERA`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `INTERNET`, `ACCESS_NETWORK_STATE`.
**Divergencias:**
- `SYSTEM_ALERT_WINDOW` aparece en `AndroidManifest.xml:8` pero no en `app.json`.
- Faltan permisos declarados explícitamente de notificaciones (`POST_NOTIFICATIONS` para Android 13+). `expo-notifications` / Firebase messaging generalmente lo inyectan, pero conviene declararlo y pedirlo en runtime.

### 8.4 Dark mode

`tailwind.config.js` define la paleta pero no hay manejo explícito de dark mode; `useColorScheme` existe pero no se consume consistentemente.

---

## 9. Accesibilidad

### 9.1 Labels y roles

- Botones icónicos (corazón en galería, compartir, abrir mapa, `eye`/`eye-off` de contraseñas) **no tienen `accessibilityLabel` ni `accessibilityRole`** en la mayoría de los casos.
  - Ejemplo: `app/(auth)/registro.tsx:128-133` (`TouchableOpacity` toggle contraseña) sin label.
  - Ejemplo: `app/(tabs)/producto/[id].tsx:126` — iconos de favorito/compartir en `Gallery`.
- `Typography` no fija `accessibilityRole="header"` para títulos `h1`/`h2`.

### 9.2 Contraste

- Paleta primaria azul oscuro sobre blanco → OK.
- Colores placeholder `#9CA3AF` sobre blanco en inputs (`app/(auth)/registro.tsx:113,125,144`) — ratio ~3.9:1, por debajo de 4.5:1 WCAG AA para texto normal.

### 9.3 Tamaños

- Sin `minimumFontScale` ni escalado tipográfico explícito. Usuarios con tamaño de fuente grande del sistema pueden ver cortes.

### 9.4 Navegación por teclado / screen reader

- Sin auditoría con TalkBack. En Closed Beta se debe ejecutar al menos un pase con TalkBack sobre: login, registro, selección de rol, home, detalle de producto, carrito, crear producto.

### 9.5 Áreas de toque

- Varios iconos pequeños (eye toggle, cerrar modales) probablemente por debajo del mínimo recomendado de 44x44. Auditar.

---

## 10. UX

### 10.1 Splash y fuentes

`app/_layout.tsx` carga fuentes Montserrat sync. Si alguna falla no hay fallback visual claro. Recomendado usar `SplashScreen.preventAutoHideAsync()` + `hideAsync()` post-fonts.

### 10.2 Pantallas vacías / error

- `LoadingState` y `ErrorState` de `app/(tabs)/producto/[id].tsx:17-35` son correctos.
- Pero en muchas pantallas (tienda, favoritos, órdenes) los estados empty/error son spinners genéricos o FlatList vacías.

### 10.3 Idioma

- 100% de la app en español salvo `app/+not-found.tsx`.

### 10.4 Pull-to-refresh

- `hooks/useRefresh.ts` existe y se usa en varias pantallas. ✔

### 10.5 Home

- 11 sliders apilados (§4.1) → scroll largo, first-meaningful-paint lento. Considerar virtualización externa o reducir sliders en primera vista.

### 10.6 Onboarding

- El flujo de rol + documentos está bien separado, pero `contexts/AuthContext.tsx` mezcla routing y fetch. Difícil de testear.

### 10.7 Carrito

- `components/cart/DetailCart.tsx` usa `Image` de RN; el parser `getColorValue` hace `startsWith` sobre strings — frágil si cambia el formato del backend.

### 10.8 Mapas

- `components/detailProduct/DetailProduct.tsx:108-109` abre Google Maps con `Linking.openURL`. Sin `canOpenURL` previo; dispositivos sin app de mapas muestran error técnico.

---

## 11. Configuración de release

### 11.1 🔴 Signing (ver §5.1)

Bloqueante.

### 11.2 🔴 ProGuard / minify (ver §5.2)

Bloqueante.

### 11.3 🟠 EAS

- `eas.json` tiene `appVersionSource: "remote"` y `autoIncrement: true` para `production`. ✔ Bueno, pero el `versionCode 2` hardcoded en `android/app/build.gradle:96` puede conflictuar si EAS auto-incrementa.
- Track `internal` configurado para submit. Para Closed Beta conviene track `beta` y revisar `eas submit --profile production --track beta` o actualizar `eas.json`.

### 11.4 🟡 `EX_DEV_CLIENT_NETWORK_INSPECTOR=true`

`android/gradle.properties:53` — debería ser `false` en builds de producción.

### 11.5 🟡 `.gitignore` vs nativo

`.gitignore:14` ignora `android/` y `ios/` pero ambos están versionados. Prebuild manual realizado; consistencia aceptable, pero documentar la estrategia (¿managed + prebuild-on-commit?).

### 11.6 🟡 Versionado

- `app.json` → `version: "1.0.3"`, `versionCode: 2`.
- `build.gradle:96-97` → `versionCode 2`, `versionName "1.0.3"`.
- Coherente por ahora, pero con `autoIncrement: true` en EAS se puede desincronizar.

### 11.7 🟡 OTA updates

`AndroidManifest.xml:19` desactiva expo-updates. Si se cierra el producto a Play-only, documentar y considerar removerlos del `package.json` si no se usan.

### 11.8 🟡 Íconos / splash

Revisar que `icon`, `adaptive-icon`, `notification.icon` en `app.json` apunten a assets existentes y cumplan spec de Play (512x512 icon PNG, foreground 108x108 dp).

---

## 12. Testing

### 12.1 Estado actual

**Cero tests.** Ni unitarios, ni integración, ni e2e. No hay `jest.config.js`, no hay `__tests__/`, no hay `detox` ni `maestro`.

### 12.2 Implicancias para Closed Beta

- Aceptable para una primera entrada a Closed Beta **si** se realiza QA manual exhaustivo sobre los flujos críticos:
  1. Login / registro / Google Sign-In.
  2. Onboarding de fabricante + upload de documentos.
  3. Home (mayorista) + scroll completo.
  4. Búsqueda + filtro + detalle de producto.
  5. Agregar al carrito + checkout + órdenes.
  6. Favoritos (⚠ crash actual).
  7. Dashboard fabricante: crear producto (fotos, colores, tallas, video), ver órdenes, ver usuarios.
  8. Notificaciones push.
  9. Cerrar sesión / sesión expirada.
  10. Modo avión / red lenta.

### 12.3 Recomendación mínima

- Añadir `jest` + `@testing-library/react-native` con un smoke test por slice y un test por utility (`validators`, `formatPrice`, `whatsapp`).
- E2E opcional: Maestro (YAML, simple) sobre 3 flujos críticos.

### 12.4 CI

- No hay `.github/workflows/`. Añadir al menos un workflow que corra `npm run lint` y `tsc --noEmit` por PR.

---

## 13. Listado completo de issues

Leyenda: 🔴 Crítico (bloquea release) · 🟠 Alto (arreglar antes de Closed Beta) · 🟡 Medio (arreglar antes de público) · 🟢 Bajo (nice-to-have).

### Bloqueantes 🔴

| # | Archivo:Línea | Descripción | Recomendación |
|---|---|---|---|
| 1 | `app/(tabs)/favoritos.tsx:1,30` | `useEffect` usado en `SkeletonCard` sin estar importado. Crash garantizado al abrir Favoritos en estado loading. | Cambiar import a `import { useCallback, useEffect } from 'react';`. |
| 2 | `android/app/build.gradle:114` | `release` buildType usa `signingConfig signingConfigs.debug`. | Generar keystore de producción; usar EAS managed signing o `gradle.properties` con variables. Nunca commitear credenciales. |
| 3 | `android/app/build.gradle:70,116` | `enableProguardInReleaseBuilds = false` → `minifyEnabled false` en release. | Poner `true` y validar `proguard-rules.pro` (reglas para Reanimated, Hermes, Firebase, Google Sign-In). Probar build. |

### Altos 🟠

| # | Archivo:Línea | Descripción | Recomendación |
|---|---|---|---|
| 4 | `services/authService.ts:52`, `store/slices/authSlice.ts:44,76,93` | JWT almacenado en `AsyncStorage` plano + persistido en redux-persist. | Instalar `expo-secure-store`, migrar `token`/`refreshToken`, excluir del whitelist o transformar con cifrado. |
| 5 | `android/app/src/main/AndroidManifest.xml:18` | `android:allowBackup="true"` → backup de Google Drive puede incluir el token. | `android:allowBackup="false"` o definir `<full-backup-content>` excluyendo AsyncStorage. |
| 6 | `hooks/useGoogleSignIn.ts:25` | `console.log('Usuario autenticado:', userInfo)` loggea `idToken`, email y nombre. | Quitar log en producción. |
| 7 | 31 archivos, 162 llamadas | `console.log/warn/error` en producción (ver lista en §3.1). | Añadir `babel-plugin-transform-remove-console` con allowlist de `error`; auditar logs de auth y API. |
| 8 | `app/_layout.tsx` (toda la app) | No hay `ErrorBoundary` global. | Implementar ErrorBoundary que envuelva `<Stack />` y reporte a Sentry/Crashlytics. |
| 9 | `contexts/AuthContext.tsx:28,41` | `setTimeout(..., 100)` para esperar hidratación. | Usar `persistor.subscribe` o `onBeforeLift` de `PersistGate`. |
| 10 | `android/app/src/main/AndroidManifest.xml:8` vs `app.json` | `SYSTEM_ALERT_WINDOW` en manifest nativo pero no en `app.json`. | Decidir si se usa; si no, quitarlo del manifest. Si sí, declararlo en `app.json` + documentar justificación (Play lo audita). |
| 11 | `android/gradle.properties:53` | `EX_DEV_CLIENT_NETWORK_INSPECTOR=true`. | Poner en `false` para producción o eliminarlo. |
| 12 | `app/(dashboard)/subir-producto/detalle-producto.tsx:195-206` | Bloque "=== DEBUG COMPLETO ===" con logs extensos. | Eliminar. |
| 13 | `app/(tabs)/producto/[id].tsx:93-97` | `console.log('currentProduct:', currentProduct)` en cada navegación. | Eliminar. |
| 14 | `services/axiosConfig.ts:147` | Logs de todas las URLs/status de error en producción. | Guardear tras `__DEV__`. |

### Medios 🟡

| # | Archivo:Línea | Descripción | Recomendación |
|---|---|---|---|
| 15 | `package.json` | `@shopify/flash-list` instalado sin uso. | Migrar al menos home, tienda, órdenes y favoritos a `FlashList`. |
| 16 | `package.json` | `@types/react-redux` deprecated. | `npm rm @types/react-redux`. |
| 17 | `components/createProduct/SelectImages.tsx:8`, `components/cart/DetailCart.tsx:1` | Usa `Image` de RN en vez de `expo-image`. | Migrar a `expo-image` (regla `ui-expo-image`). |
| 18 | `components/home/ProductSlider.tsx:78-83` | `new Intl.NumberFormat(...)` creado en render. | Hoistear al módulo (regla `js-hoist-intl`). |
| 19 | `app/(tabs)/index.tsx:57-72` | 11 `ProductSlider` en un `ScrollView`. | Virtualizar con FlashList de secciones o lazy-mount al scrollear. |
| 20 | `components/shop/Shop.tsx` | Stub sin uso real. | Eliminar del bundle. |
| 21 | `components/examples/*.tsx` | Ejemplos didácticos shippeados. | Mover a `examples/` fuera del árbol de app o excluir en producción. |
| 22 | `hooks/useAuth.ts` | Hook legacy, reemplazado por `useAuthContext`. | Eliminar o marcarlo como deprecated. |
| 23 | `app/+not-found.tsx` | Strings en inglés. | Traducir. |
| 24 | `app.json` | `supportsTablet: true` (iOS) sin UI tablet. | Poner `false` si no se valida. |
| 25 | `app.json` / `AndroidManifest.xml` | Permiso `POST_NOTIFICATIONS` no declarado explícitamente. | Declararlo y pedirlo en runtime en Android 13+. |
| 26 | `config/googleSignIn.ts:7`, `utils/whatsapp.ts:3`, `constants/ApiConfig.ts:16` | Valores hardcoded (webClientId, teléfono, IP). | Mover a `expo-constants` + `app.config.js` con env. |
| 27 | `services/axiosConfig.ts` | Dynamic `await import('@/store')` en cada request. | Pasar getState como dependencia inyectada al construir los interceptors. |
| 28 | Toda la app | Sin `@react-native-community/netinfo`. | Instalar y mostrar banner offline. |
| 29 | Toda la app | Sin Crashlytics / Sentry. | Integrar `@sentry/react-native` o `@react-native-firebase/crashlytics`. |
| 30 | `android/app/src/main/AndroidManifest.xml:31-32` | Deep link `exp+fd-app` es residuo de Expo Go. | Remover del manifest de producción. |
| 31 | `eslint.config.js` | Solo extiende `expo-config`. | Añadir `no-console`, `react-hooks/exhaustive-deps` como error, `@typescript-eslint/no-explicit-any` como warn. |
| 32 | 39 archivos | 112 `any` explícitos. | Tipado progresivo; priorizar thunks y hooks. |
| 33 | `components/cart/DetailCart.tsx` | Parser `getColorValue` con `startsWith`. | Tipar respuesta del backend para recibir estructura determinista. |
| 34 | `components/detailProduct/DetailProduct.tsx:108-109` | `Linking.openURL` de mapa sin `canOpenURL`. | Usar `canOpenURL` + fallback a navegador web. |
| 35 | `utils/validators.ts:11-15` | Regex y mensaje de contraseña inconsistentes. | Alinear mensaje con regex exacta (incluir special chars si los permite). |
| 36 | `services/notificationService.ts:34` | Log `🔔 FCM Token registrado` en cada arranque. | Guardear tras `__DEV__`. |
| 37 | `store/index.ts` | Sin migraciones para slices persistidos. | Añadir `migrate` config al `persistConfig` y versionar. |

### Accesibilidad / UX 🟡

| # | Archivo:Línea | Descripción | Recomendación |
|---|---|---|---|
| 38 | `app/(auth)/registro.tsx:128-133,147-152` | Toggles de contraseña sin `accessibilityLabel`. | Añadir label dinámico ("Mostrar/Ocultar contraseña"). |
| 39 | `app/(tabs)/producto/[id].tsx` (iconos de Gallery) | Favorito y compartir sin rol/nombre. | Añadir `accessibilityLabel`/`Role="button"`. |
| 40 | Inputs de auth | Placeholder `#9CA3AF` con contraste ~3.9:1. | Subir contraste o elevar label visible. |
| 41 | `Typography` | Títulos sin `accessibilityRole="header"`. | Añadir. |
| 42 | Iconos tap-targets | Varios íconos <44x44. | Envolver en `Pressable` con `hitSlop` o aumentar padding. |

### Bajos 🟢

| # | Archivo:Línea | Descripción | Recomendación |
|---|---|---|---|
| 43 | `hooks/useAuth.ts:9-12` | Logs comentados. | Eliminar. |
| 44 | `utils/hardcode.ts` | 167 líneas de categorías hardcoded. | Mover a backend a mediano plazo. |
| 45 | `app/_layout.tsx` carga de fuentes | Sin splash manejado manualmente. | `SplashScreen.preventAutoHideAsync()` + hide tras fonts + auth. |
| 46 | `.gitignore:14` | `android/`/`ios/` ignorados pero versionados. | Documentar estrategia o ajustar `.gitignore`. |

---

## 14. Top-5 y Top-5

### 14.1 Top-5 a resolver SÍ O SÍ antes de Closed Beta

1. **Fix import de `useEffect` en `app/(tabs)/favoritos.tsx:1`.**
   Una línea. Sin esto, todos los mayoristas que abran Favoritos ven un crash.

2. **Generar keystore de producción y configurar `android/app/build.gradle:111-119`.**
   Subir el keystore a EAS secrets (`eas credentials`) o a variables de `gradle.properties` local. Validar que `./gradlew bundleRelease` produzca un `.aab` firmado correctamente.

3. **Activar ProGuard/minify (`android/app/build.gradle:70,116`).**
   Poner `enableProguardInReleaseBuilds = true`. Añadir reglas en `android/app/proguard-rules.pro` para Hermes, Reanimated, Firebase y Google Sign-In (todas publican reglas oficiales). Probar un build release completo.

4. **Migrar JWT a `expo-secure-store` y poner `allowBackup="false"`.**
   `npx expo install expo-secure-store`, envolver `tokenService` con Secure Store, excluir `token` del whitelist de redux-persist, editar `AndroidManifest.xml:18`.

5. **Eliminar logs sensibles y añadir `babel-plugin-transform-remove-console`.**
   Mínimo, borrar `hooks/useGoogleSignIn.ts:25`, el bloque "=== DEBUG COMPLETO ===" en `detalle-producto.tsx:195-206`, y `app/(tabs)/producto/[id].tsx:93-97`. Instalar el plugin Babel con `exclude: ['error']` para dejar `console.error` solo.

### 14.2 Top-5 recomendaciones post-lanzamiento

1. **Crash reporting + telemetría (`@sentry/react-native` o Crashlytics) + `ErrorBoundary` global.**
   Sin esto, los reportes de testers son anecdóticos. Sentry integra con Redux para mandar acciones como breadcrumbs.

2. **Migrar listas a `@shopify/flash-list`.**
   Ya está instalado. Empezar por home, tienda, órdenes, favoritos. Memoizar items y estabilizar callbacks (reglas `list-performance-*`).

3. **Tests mínimos + CI.**
   `jest` + `@testing-library/react-native` con 10-15 tests que cubran validators, formatters, reducers y un smoke de auth. GitHub Actions con `lint` + `tsc --noEmit` + `jest`.

4. **Accesibilidad + i18n.**
   Pase con TalkBack sobre los 10 flujos críticos, agregar `accessibilityLabel`/`Role` en iconos, corregir contraste. Evaluar `expo-localization` para futura expansión regional.

5. **Config por entorno con `app.config.ts` + variables.**
   Reemplazar hardcodes (webClientId, IP LAN, teléfono) por `expo-constants` + `.env` + `eas.json > env`. Facilita rotación de claves y multi-ambiente.

---

## Anexos

### Comandos sugeridos para validar los fixes bloqueantes

```bash
# 1) Validar que favoritos compila y monta
npm run lint
npx tsc --noEmit

# 2) Generar keystore de producción (ejemplo local, no commitear el .jks)
keytool -genkeypair -v -keystore fd-release.jks -alias fd-release \
  -keyalg RSA -keysize 2048 -validity 10000

# 3) Probar un build release firmado localmente
cd android && ./gradlew bundleRelease

# 4) O vía EAS (preferido)
npm run build:android   # profile production
```

### Checklist pre-submit a Closed Beta

- [ ] `favoritos.tsx` — crash corregido
- [ ] Keystore de producción configurado en EAS
- [ ] `enableProguardInReleaseBuilds = true` + reglas ProGuard validadas
- [ ] `allowBackup="false"`
- [ ] `expo-secure-store` reemplazando AsyncStorage para token
- [ ] `babel-plugin-transform-remove-console` activo
- [ ] `EX_DEV_CLIENT_NETWORK_INSPECTOR=false`
- [ ] `SYSTEM_ALERT_WINDOW` decidido (quitar o declarar en `app.json`)
- [ ] `versionCode` y `versionName` sincronizados entre `app.json` y `build.gradle`
- [ ] QA manual sobre los 10 flujos del §12.2
- [ ] Build AAB firmado + instalado en al menos 2 dispositivos Android reales
- [ ] Deep links `fdapp://` probados; `exp+fd-app` removido

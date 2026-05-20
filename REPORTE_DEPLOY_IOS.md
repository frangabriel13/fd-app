# 📱 Reporte: Deploy a iOS de Fabricante Directo

## 📊 Estado actual

**Obligatorios (1–11):** 8/11 completos en código, 3 con placeholders esperando datos externos, 1 inscripción en curso.
**Recomendados (12–23):** 0/12 aplicados (decisión consciente — postergados hasta tener iOS estable en TestFlight).
**Backend:** ✅ Endpoints `DELETE /users/me`, `POST /notifications/device-token` (payload iOS/Android diferenciado) y `POST /api/auth/refresh-token` confirmados listos.

Leyenda:
- ✅ Aplicado en código / completo
- ⚠️ Acción manual pendiente (cuenta externa, archivo, placeholder)
- ⏳ En progreso / no iniciado

---

## 🔴 Cambios OBLIGATORIOS (sin estos la app no compila ni pasa review de Apple)

### 1. Firebase iOS: falta `GoogleService-Info.plist`
✅ Referencia agregada en `app.json` → `ios.googleServicesFile: "./GoogleService-Info.plist"`.
⚠️ **Pendiente manual:** crear app iOS en Firebase Console (bundle id `com.fabricantedirecto.fdapp`) → descargar `GoogleService-Info.plist` → dejarlo en raíz del proyecto.

### 2. Permisos iOS (Info.plist usage descriptions)
✅ **Completo.** Plugin `expo-image-picker` en `app.json` con `photosPermission`, `cameraPermission`, `microphonePermission` (textos específicos en español).

### 3. Notificaciones Push (APNs)
✅ Configuración en `app.json`: `ios.entitlements.aps-environment: "production"` + `ios.infoPlist.UIBackgroundModes: ["remote-notification", "fetch"]` + `ITSAppUsesNonExemptEncryption: false`.
✅ Backend ya envía payload APNs diferenciado con `aps.badge` (no-leídas del usuario) y `aps.sound: "default"`.
⚠️ **Pendiente manual:** generar APNs Auth Key (.p8) en Apple Developer → subirla a Firebase Console → Cloud Messaging → Apple app configuration. Sin esto los tokens iOS no reciben nada aunque el payload sea correcto.

### 4. Bug en `hooks/useNotifications.ts:26` — plataforma hardcoded a `'android'`
✅ **Completo.** Cambiado `platform: 'android'` por `Platform.OS` (import `Platform` agregado de `react-native`). Backend confirmó que acepta `'ios'` y enruta el payload correcto según plataforma.

### 5. Google Sign-In iOS
✅ `config/googleSignIn.ts` con `iosClientId` (placeholder `IOS_CLIENT_ID_PLACEHOLDER.apps.googleusercontent.com`).
✅ `app.json` con `ios.infoPlist.CFBundleURLTypes` y URL scheme reverso (placeholder `com.googleusercontent.apps.IOS_CLIENT_ID_REVERSED`).
⚠️ **Pendiente manual:** crear OAuth Client ID iOS en Google Cloud Console (mismo proyecto que el web client `378911157109-...`) → reemplazar ambos placeholders con el client ID real.

### 6. `expo-build-properties` — pods estáticos para Firebase + iOS deployment target
✅ **Completo.** Paquete `expo-build-properties@~0.14.8` instalado en `package.json`. Plugin agregado a `app.json` con `ios.useFrameworks: "static"` y `ios.deploymentTarget: "15.1"`.

### 7. `eas.json` — perfil de submit iOS
✅ Sección `submit.production.ios` agregada con `appleId: "mansilla.franco.1@gmail.com"`.
⚠️ **Pendiente manual:** reemplazar `APP_STORE_CONNECT_APP_ID_PLACEHOLDER` (lo da App Store Connect al crear la app) y `APPLE_TEAM_ID_PLACEHOLDER` (lo da Apple Developer Portal — Membership info).

### 8. Scripts de build iOS en `package.json`
✅ **Completo.** Scripts `build:ios` y `submit:ios` agregados.

### 9. Privacy Manifest (`PrivacyInfo.xcprivacy`)
✅ **Verificado.** Expo SDK 53 genera el manifest base automáticamente. Dependencias confirmadas que incluyen su propio manifest:
- `@react-native-firebase/*@23.x` ✓
- `@react-native-google-signin/google-signin@15.x` ✓
- `@react-native-async-storage/async-storage@2.x` ✓
- `expo-*@SDK 53` ✓

> **Pendiente al subir a App Store Connect:** completar la sección "App Privacy" declarando: emails, datos de uso, identificadores de dispositivo (FCM). No se usa: ubicación, IDFA, analytics.

### 10. Eliminación de cuenta in-app (Guideline 5.1.1(v))
✅ **Completo (frontend + backend).**
- `store/slices/userSlice.ts`: thunk `deleteAccount` → `DELETE /users/me`.
- `components/account/MenuAccount.tsx`: sección "Cuenta" con botón "Eliminar mi cuenta" en estilo destructivo, doble confirmación (modal explicativo + Alert "¿Estás seguro?"), estado `deleting` para evitar doble-tap.
- Flujo post-éxito: `removeDeviceToken()` → `dispatch(deleteAccount())` → `signOut()` Google → `AsyncStorage.removeItem('token')` → `dispatch(logout())` + `clearNotifications()` + `resetFavorites()` → `persistor.purge()` → `router.replace('/(auth)/login')`.
- Backend confirmó endpoint `DELETE /api/users/me`: anonimiza usuario (email → `deleted_<id>@anon.local`), anonimiza perfil según rol, elimina device tokens / verification tokens / reviews / favoritos / vistas / notificaciones / follows, **invalida JWT** (blacklist), **preserva órdenes** (FK intacto, dato personal vacío) — cumple requisitos legales B2B.

### 11. Cuentas y programa de Apple Developer
⏳ **En curso.** Inscripción Individual al Apple Developer Program (USD 99/año) iniciándose. Tarda 24–48 hs en aprobarse.
⚠️ **Pendiente:**
- Completar enroll en https://developer.apple.com/programs/enroll/
- Crear App en App Store Connect con bundle id `com.fabricantedirecto.fdapp` una vez aprobada.

---

## 🔧 Cambio extra aplicado (no listado en reporte original)

### Refresh token endpoint actualizado
✅ `services/authService.ts`: `refreshTokenService` ahora apunta a `POST /auth/refresh-token` (canónico confirmado por backend) en vez de `POST /manufacturers/refresh-token` (legacy). Backend confirmó que acepta JWT válido o expirado en `Authorization` header y devuelve `{ auth: true, token: '...' }` con 24h de vigencia.

---

## 🟡 Cambios RECOMENDADOS (no bloquean pero evitan rechazo o problemas)

> **Decisión:** todos postergados hasta tener iOS estable en TestFlight. Revaluar después de la primera build exitosa.

### 12. Icono adaptativo y splash iOS
⏳ No iniciado.
- `assets/images/icon.png` ya es 1024×1024 ✓ — verificar que sea **sin transparencia** ni bordes redondeados (iOS los aplica solo).
- `splash-icon.png` ya es 1024×1024 ✓ — verificar que se vea bien sobre fondo blanco.

### 13. `supportsTablet: true` con UI no optimizada para iPad
⏳ No iniciado.
**Acción:** decidir entre:
- **A (más simple):** cambiar a `"supportsTablet": false`. La app sale solo a iPhone — válido y común para apps B2B mobile-first.
- **B:** auditar la UI en iPad y agregar layouts responsivos.

### 14. `expo-av` está deprecado
⏳ No iniciado. Migrar `components/createProduct/SelectVideo.tsx` y `components/detailProduct/Gallery.tsx` a `expo-video`. **Postergado** porque toca código compartido con Android — riesgo de regresión.

### 15. Política de privacidad y términos — URLs públicas
⏳ No iniciado. `PRIVACY_POLICY.md` y `TERMS_OF_SERVICE.md` existen localmente. Apple exige URLs públicas para ambos en App Store Connect.
**Acción:** publicar en un dominio accesible y completar en App Store Connect:
- Privacy Policy URL
- Support URL
- Marketing URL (opcional)

### 16. IAP / compras (solo si aplica)
⏳ No iniciado. Las suscripciones son B2B (transferencia bancaria/factura) — documentar en "Review notes" al enviar la build que los pagos son entre empresas, no consumer-facing.

### 17. Badge en iOS via APNs payload
✅ **Cubierto del lado backend.** Confirmado que el backend envía `aps.badge` con el contador de no-leídas en el payload APNs. La app sigue manejando `incrementUnread()` solo en foreground (correcto).

### 18. `react-native.config.js` solo declara Android
⏳ No iniciado. Agregar `ios: { sourceDir: './ios' }` o eliminar el archivo (Expo prebuild es la dirección recomendada).

### 19. `scheme: "fdapp"` corto y genérico
⏳ No iniciado. **Riesgo:** cambiar el scheme afecta deep links existentes en Android e iOS.

### 20. LAN IP hardcodeada
⏳ No iniciado. `constants/ApiConfig.ts:16` con `192.168.1.43` — mover a `process.env.EXPO_PUBLIC_LOCAL_IP`.

### 21. Delays Android-only en pickers
⏳ No iniciado. `setTimeout(100)` envuelto en `if (Platform.OS === 'android')` en `SelectImages.tsx:113`, `EditProductImages.tsx:138`, `LiveAccount.tsx:73`. Testear bien estos flujos en iOS.

### 22. `expo-av` audio session config (si usás video con sonido)
⏳ No iniciado. `Audio.setAudioModeAsync({...})` al iniciar la app — para que los videos suenen en iOS con switch de silencio activo. **Riesgo:** afecta también Android.

### 23. App Tracking Transparency — NO aplica
✅ **Verificado.** La app no usa Firebase Analytics, IDFA, ni SDKs de tracking. Solo `@react-native-firebase/app` + `messaging`. No requiere `NSUserTrackingUsageDescription` ni prompt ATT.

---

## 📋 Pasos restantes para deploy a iOS

1. ⏳ **Apple Developer Program** — inscripción Individual en curso (USD 99/año).
2. ⚠️ **App Store Connect** → crear app con bundle id `com.fabricantedirecto.fdapp` (post-aprobación Apple).
3. ⚠️ **Firebase Console** → agregar app iOS → descargar `GoogleService-Info.plist` a la raíz.
4. ⚠️ **APNs Auth Key (.p8)** en Apple Developer → subir a Firebase Cloud Messaging.
5. ⚠️ **Google Cloud Console** → crear OAuth Client ID iOS → reemplazar placeholders.
6. ⚠️ **eas.json** → reemplazar `APP_STORE_CONNECT_APP_ID_PLACEHOLDER` y `APPLE_TEAM_ID_PLACEHOLDER`.
7. ⚠️ Publicar **Privacy Policy** y **Terms of Service** en URLs públicas.
8. `npx eas credentials` → configurar credenciales iOS (EAS las puede generar automático).
9. `npm run build:ios` → genera el `.ipa`.
10. `npm run submit:ios` → sube a TestFlight.
11. Probar en TestFlight: login email/password, login Google, push (foreground/background/cerrada), cámara, galería, video, **eliminar cuenta**.
12. Completar ficha de App Store Connect: screenshots, descripción, categorías, rating, privacy declarations, review notes (aclarar pagos B2B).
13. Submit for review → tiempo típico 24–48 hs.

---

## 🎯 Resumen ejecutivo

**Ya hecho en código (10/11 obligatorios + sync con backend):**
- Configuración iOS completa en `app.json`, `eas.json`, `package.json`.
- Bug `Platform.OS` arreglado.
- Eliminación de cuenta in-app implementada y conectada al endpoint backend.
- Refresh token alineado con ruta canónica del backend.
- `expo-build-properties` instalado para que Firebase compile en iOS.

**Pendiente (todo manual, no requiere más código):**
- Cuenta Apple Developer (en curso).
- 4 archivos/IDs externos a obtener: `GoogleService-Info.plist`, OAuth iOS Client ID, APNs Key, Apple Team ID + ASC App ID.

**Nota Sign in with Apple:** Guideline 4.8 NO aplica — la app tiene login propio email/password, Google es solo opcional.

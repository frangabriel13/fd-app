# 📱 Reporte: Deploy a iOS de Fabricante Directo

## ❌ Veredicto: **NO se puede deployar tal como está. Requiere cambios obligatorios.**

La app fue construida exclusivamente para Android (Google Play). Tiene configuración básica de iOS en `app.json` (solo `bundleIdentifier`) pero le faltan piezas críticas para compilar, pasar review de Apple y funcionar correctamente.

> **Nota:** este reporte fue actualizado tras una auditoría completa del código. Los items obligatorios cubren configuración nativa básica + un bug real detectado en el código (`useNotifications.ts:26`, item #4). Los recomendados cubren UX, performance y best practices.

---

## 🔴 Cambios OBLIGATORIOS (sin estos la app no compila ni pasa review de Apple)

### 1. Firebase iOS: falta `GoogleService-Info.plist`
**Qué:** La app usa `@react-native-firebase/app` + `@react-native-firebase/messaging`. En `app.json` solo está declarado `googleServicesFile` para Android. Sin el archivo `.plist` equivalente, Firebase no inicializará en iOS y la build fallará.

**Por qué:** React Native Firebase requiere el archivo de configuración nativo de cada plataforma.

**Acción:**
- Agregar la app iOS en Firebase Console (bundle id `com.fabricantedirecto.fdapp`).
- Descargar `GoogleService-Info.plist`, colocarlo en la raíz.
- Agregar en `app.json` → `ios`:
```json
"googleServicesFile": "./GoogleService-Info.plist"
```

### 2. Permisos iOS (Info.plist usage descriptions)
**Qué:** La app usa cámara, galería de fotos y video (`expo-image-picker`, `expo-av`, subida de logos/productos/documentos). iOS **rechaza** builds sin textos de uso declarados — y Apple rechaza en review si los mensajes son genéricos.

**Por qué:** App Store Review Guideline 5.1.1 — Purpose strings obligatorios.

**Acción (forma idiomática):** completar el plugin `expo-image-picker` que ya existe en `app.json:53-58` (actualmente solo tiene `photosPermission`):
```json
[
  "expo-image-picker",
  {
    "photosPermission": "Necesitamos acceso a tus fotos para que puedas seleccionar imágenes de productos, logo y documentos de verificación.",
    "cameraPermission": "Necesitamos acceso a la cámara para que puedas tomar fotos de tus productos, logo y documentos de verificación.",
    "microphonePermission": "Necesitamos acceso al micrófono para grabar videos de productos."
  }
]
```

**Acción (alternativa por `infoPlist` directo)** — si preferís no tocar el plugin:
```json
"infoPlist": {
  "NSCameraUsageDescription": "Necesitamos acceso a la cámara para que puedas tomar fotos de tus productos, logo y documentos de verificación.",
  "NSPhotoLibraryUsageDescription": "Necesitamos acceso a tus fotos para que puedas seleccionar imágenes de productos, logo y documentos.",
  "NSPhotoLibraryAddUsageDescription": "Necesitamos guardar imágenes en tu galería.",
  "NSMicrophoneUsageDescription": "Necesitamos acceso al micrófono para grabar videos de productos.",
  "ITSAppUsesNonExemptEncryption": false
}
```
> ⚠️ No usar las dos formas a la vez — pueden generar entradas duplicadas/conflictivas en el `Info.plist` generado por Expo prebuild.
>
> El último flag (`ITSAppUsesNonExemptEncryption`) evita el prompt de export compliance en cada build.

### 3. Notificaciones Push (APNs)
**Qué:** iOS no usa FCM directamente, usa APNs. Firebase Messaging en iOS necesita:
- Certificado/key APNs subido a Firebase Console.
- Capability "Push Notifications" + "Background Modes → Remote notifications" habilitados.
- `aps-environment` entitlement.
- `UIBackgroundModes` declarado en `Info.plist` (sin esto, `messaging().setBackgroundMessageHandler` en `app/_layout.tsx:14` **no recibe mensajes** con la app cerrada en iOS).

**Por qué:** Sin esto, los tokens FCM en iOS no se generan y las notificaciones nunca llegan o no se procesan en background.

**Acción:**
- En Apple Developer Portal: crear APNs Auth Key (.p8), subirla a Firebase → Project Settings → Cloud Messaging → iOS.
- Agregar al `app.json`:
```json
"ios": {
  "bundleIdentifier": "com.fabricantedirecto.fdapp",
  "supportsTablet": true,
  "entitlements": {
    "aps-environment": "production"
  },
  "infoPlist": {
    "UIBackgroundModes": ["remote-notification", "fetch"]
  }
}
```
- Habilitar Push Notifications capability en el provisioning profile (EAS lo puede hacer automático).

### 4. Bug en `hooks/useNotifications.ts:26` — plataforma hardcoded a `'android'`
**Qué:** En el callback de `onTokenRefresh`, el campo `platform` está fijo en `'android'`:
```ts
unsubscribeRefresh.current = onTokenRefresh(async (newToken) => {
  await notificationInstance.post('/device-token', {
    token: newToken,
    platform: 'android',   // ← bug: debe ser Platform.OS
  });
});
```

**Por qué:** En iOS, cada vez que el token FCM se refresque (cambio de instalación, restore, etc.) se enviará al backend etiquetado como Android. La segmentación de push y la elección de payload (FCM vs APNs en el backend) quedará rota.

**Acción:** importar `Platform` y usar `Platform.OS` (igual que ya hace `services/notificationService.ts:31`).

### 5. Google Sign-In iOS
**Qué:** En `config/googleSignIn.ts:14-15` los campos `iosClientId` y `googleServicePlistPath` están vacíos. El botón de Google Sign-In no funcionará en iOS.

**Por qué:** Google Sign-In en iOS usa OAuth con URL schemes que se leen del `.plist`.

**Acción:**
- Crear OAuth client para iOS en Google Cloud Console (el mismo proyecto que Firebase).
- Completar en `config/googleSignIn.ts`:
```ts
iosClientId: '<CLIENT_ID>.apps.googleusercontent.com',
```
- Agregar el URL scheme reverso en `app.json` → `ios.infoPlist.CFBundleURLTypes`:
```json
"CFBundleURLTypes": [{
  "CFBundleURLSchemes": ["com.googleusercontent.apps.<CLIENT_ID>"]
}]
```

### 6. `expo-build-properties` — pods estáticos para Firebase + iOS deployment target
**Qué:** No está instalado `expo-build-properties`. Con `@react-native-firebase/app@23.x` + `newArchEnabled: true` (declarado en `app.json:10`), las builds iOS suelen fallar con errores tipo `non-modular header in framework module` o conflictos de pods si no se fuerzan pods estáticos.

**Por qué:** Firebase iOS distribuye binarios como `.xcframework`. Con `use_frameworks!` dinámico (default) se rompen los headers de Swift/Objective-C en módulos como `FirebaseCore`.

**Acción:**
- Instalar:
```bash
npx expo install expo-build-properties
```
- Agregar en `app.json` → `plugins`:
```json
[
  "expo-build-properties",
  {
    "ios": {
      "useFrameworks": "static",
      "deploymentTarget": "15.1"
    }
  }
]
```

### 7. `eas.json` — perfil de submit iOS
**Qué:** La sección `submit.production` solo contempla Android.

**Acción:** Agregar:
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "mansilla.franco.1@gmail.com",
      "ascAppId": "<APP_STORE_CONNECT_APP_ID>",
      "appleTeamId": "<APPLE_TEAM_ID>"
    },
    "android": { ... }
  }
}
```

### 8. Scripts de build iOS en `package.json`
**Qué:** No existen `build:ios` ni `submit:ios`.

**Acción:** Agregar:
```json
"build:ios": "npx eas build --platform ios --profile production",
"submit:ios": "npx eas submit --platform ios --profile production"
```

### 9. Privacy Manifest (`PrivacyInfo.xcprivacy`)
**Qué:** Apple **exige** este archivo desde mayo 2024 para cualquier app que use APIs de "required reason" (`UserDefaults`, `FileTimestamp`, `SystemBootTime`, etc.) o ciertos SDKs de terceros (Firebase, Google Sign-In, AsyncStorage, etc.).

**Por qué:** App Store Connect rechaza el upload del .ipa o el binario en review si el manifest está incompleto o si los SDKs de terceros no traen el suyo.

**Acción:**
- Expo SDK 53 genera un manifest base automáticamente — verificalo en la build.
- Confirmá que las versiones actuales de tus dependencias incluyen su propio `PrivacyInfo.xcprivacy`:
  - `@react-native-firebase/*@23.x` → ✅ lo incluye
  - `@react-native-google-signin/google-signin@15.x` → ✅ lo incluye
  - `@react-native-async-storage/async-storage@2.x` → ✅ lo incluye
  - `expo-*@SDK 53` → ✅ lo incluye
- Si tu privacy declarations en App Store Connect no coinciden con el manifest, Apple rechaza. Completá la sección "App Privacy" en App Store Connect declarando: emails, datos de uso, identificadores de dispositivo (FCM), ubicación (no usás), etc.

### 10. Eliminación de cuenta in-app (Guideline 5.1.1(v))
**Qué:** Apple **exige** desde junio 2022 que toda app que permita crear cuentas también ofrezca un mecanismo dentro de la app para que el usuario elimine su cuenta y los datos asociados.

La app tiene flujo de registro (`app/(auth)/registro.tsx`) pero **no hay**:
- Opción "Eliminar mi cuenta" en `components/account/MenuAccount.tsx`.
- Endpoint en `store/slices/userSlice.ts` (solo existe `unfollow` de fabricantes).
- Lógica en el backend para borrar usuario + datos derivados.

**Por qué:** Rechazo seguro en review de Apple. Es uno de los items que más rechaza Apple en apps recientes que migran de Android.

**Acción:**
- Backend: implementar endpoint `DELETE /users/me` (o equivalente) que borre el usuario, sus suscripciones, productos, órdenes, reviews, favoritos y device tokens. Considerá si necesitás soft-delete por requisitos legales/contables (B2B con facturación) — si las órdenes deben preservarse, anonimizar el usuario en lugar de borrar es válido siempre que el dato personal desaparezca.
- App: agregar en `MenuAccount.tsx` un item "Eliminar mi cuenta" con confirmación de doble paso (modal con texto explicativo + segundo modal "¿Estás seguro? Esta acción no se puede deshacer").
- Después de borrar: hacer logout (`dispatch(logout())`), limpiar persist (`persistor.purge()`) y redirigir a `/(auth)/login`.
- Puede tener una pantalla web equivalente en https://fabricantedirecto.com/eliminar-cuenta para usuarios externos, pero **no reemplaza** la opción in-app.

### 11. Cuentas y programa de Apple Developer
**Qué:** No es un cambio de código, pero es bloqueante:
- **Apple Developer Program**: USD 99/año.
- **App Store Connect**: crear la ficha de la app con bundle id `com.fabricantedirecto.fdapp`.
- Sin estos no hay deploy posible — EAS los necesita para firmar y subir.

---

## 🟡 Cambios RECOMENDADOS (no bloquean pero evitan rechazo o problemas)

### 12. Icono adaptativo y splash iOS
- `assets/images/icon.png` ya es 1024×1024 ✓ — verificar que sea **sin transparencia** ni bordes redondeados (iOS los aplica solo).
- `splash-icon.png` ya es 1024×1024 ✓ — verificar que se vea bien sobre fondo blanco. iOS no usa `adaptiveIcon` (eso es solo Android).

### 13. `supportsTablet: true` con UI no optimizada para iPad
**Qué:** `app.json:13` declara `supportsTablet: true`, pero los componentes están diseñados para móvil portrait con clases de Tailwind fijas (sin breakpoints para tablets). Apple puede rechazar si en iPad la app se ve estirada o rota.

**Acción:** decidir entre:
- **A (más simple):** cambiar a `"supportsTablet": false`. La app sale solo a iPhone — válido y común para apps B2B mobile-first.
- **B:** dedicar tiempo a auditar la UI en iPad (iPad mini, iPad, iPad Pro 11"/12.9") y agregar layouts responsivos.

### 14. `expo-av` está deprecado
**Qué:** `package.json` usa `expo-av` para video (`SelectVideo.tsx`, `Gallery.tsx`). En Expo SDK 53+ recomienda migrar a `expo-video`. Para App Store review esto no importa, pero `expo-av` puede dar warnings en iOS con la nueva arquitectura (`newArchEnabled: true`).

**Acción (opcional):** migrar `components/createProduct/SelectVideo.tsx` y `components/detailProduct/Gallery.tsx` a `expo-video`.

### 15. Política de privacidad y términos — URLs públicas
**Qué:** Ya tenés `PRIVACY_POLICY.md` y `TERMS_OF_SERVICE.md` localmente. Apple **exige** URLs públicas para ambos en la ficha de App Store Connect.

**Acción:** publicar los documentos en un dominio accesible y completar en App Store Connect:
- Privacy Policy URL
- Support URL
- Marketing URL (opcional)

### 16. IAP / compras (solo si aplica)
Si la app tiene suscripciones de pago (hay `subscriptions` en el user slice y `SubscriptionModal.tsx` que abre URLs externas con `Linking.openURL`), Apple exige usar **StoreKit / In-App Purchase** — no pasarelas externas. Si las suscripciones se pagan fuera de la app (flujo B2B con factura/transferencia bancaria), es aceptable pero hay que documentarlo claramente en el "Review notes" al enviar la build, indicando que los pagos son entre empresas y no transacciones de consumidor final.

### 17. Badge en iOS via APNs payload
**Qué:** `hooks/useNotifications.ts:54` hace `incrementUnread()` solo en `onMessage` (foreground). En iOS el badge real lo controla APNs (campo `badge` en el payload de la notificación), no la app.

**Acción:** coordinar con backend para que las notificaciones a iOS incluyan `apns: { payload: { aps: { badge: N } } }` con el contador del usuario en el momento del envío.

### 18. `react-native.config.js` solo declara Android
```js
module.exports = {
  project: { android: { packageName: 'com.fabricantedirecto.fdapp' } },
};
```
**Acción:** o bien agregar `ios: { sourceDir: './ios' }`, o eliminar el archivo si confiás 100% en Expo prebuild (que es la dirección recomendada para apps que no mantienen la carpeta `ios/` versionada).

### 19. `scheme: "fdapp"` corto y genérico
`app.json:8`. Funciona para deep links en iOS, pero un scheme tan corto puede colisionar con otra app. Considerá `fabricantedirecto` o similar.

### 20. LAN IP hardcodeada
`constants/ApiConfig.ts:16` tiene `192.168.1.43` hardcoded para dev. No afecta prod, pero conviene leerla de `process.env.EXPO_PUBLIC_LOCAL_IP` o `expo-constants` para que el dev iOS no pise el valor del dev Android.

### 21. Delays Android-only en pickers
En `SelectImages.tsx:113`, `EditProductImages.tsx:138` y `LiveAccount.tsx:73` hay un `setTimeout(100)` envuelto en `if (Platform.OS === 'android')`. No rompe iOS pero es señal de que el código solo fue probado en Android — testear bien estos flujos en iOS (`launchCameraAsync`, `launchImageLibraryAsync`).

### 22. `expo-av` audio session config (si usás video con sonido)
Si querés controlar comportamiento de audio en iOS (reproducir con el ringer en silencio, mantener audio con app en background), hace falta `Audio.setAudioModeAsync({...})` al iniciar la app. Hoy no se hace y los videos en iOS pueden no sonar si el usuario tiene el switch de silencio activo.

### 23. App Tracking Transparency — NO aplica
**Verificado:** la app no usa Firebase Analytics, IDFA, ni ningún SDK de tracking. Solo `@react-native-firebase/app` + `messaging` (push notifications, no analytics). Por lo tanto **no necesitás** declarar `NSUserTrackingUsageDescription` ni mostrar el prompt ATT. Si en el futuro agregás analytics o ads, esto cambia.

---

## 📋 Pasos para deploy a iOS (una vez hechos los cambios obligatorios)

1. **Alta en Apple Developer Program** (USD 99/año) — [developer.apple.com](https://developer.apple.com).
2. **Crear App en App Store Connect** con bundle id `com.fabricantedirecto.fdapp`.
3. **Firebase Console**: agregar app iOS → descargar `GoogleService-Info.plist`.
4. **APNs**: crear Auth Key (.p8) en Apple Developer → subir a Firebase Cloud Messaging.
5. **Google Cloud Console**: crear OAuth Client ID para iOS.
6. Aplicar cambios 1–11 de la sección obligatoria (Firebase plist, permisos, APNs/UIBackgroundModes, fix bug `useNotifications.ts:26`, Google Sign-In iOS, `expo-build-properties`, `eas.json`, scripts, Privacy Manifest, **eliminación de cuenta in-app + endpoint backend**, cuenta Apple Dev).
7. `npx eas credentials` → configurar credenciales iOS (EAS las puede generar automático, incluyendo Push capability).
8. `npm run build:ios` → genera el `.ipa`.
9. `npm run submit:ios` → sube a TestFlight.
10. Probar en TestFlight con usuarios internos — especialmente: login email/password, login Google, push en foreground/background/cerrada, cámara, galería, video.
11. Enviar para review desde App Store Connect (completando ficha: screenshots, descripción, categorías, rating, privacy, **review notes** explicando que las suscripciones son B2B fuera de la app si aplica).
12. Tiempo típico de review: 24–48 hs.

---

## 🎯 Resumen ejecutivo

**11 cambios obligatorios** y **12 recomendados**.

Los más críticos (en orden de impacto):

1. **Eliminación de cuenta in-app** (#10) — rechazo seguro en review desde junio 2022 si se permite registro y no hay forma de borrar cuenta. **Requiere trabajo en backend + UI**.
2. **`expo-build-properties` con `useFrameworks: 'static'`** (#6) — la build iOS típicamente falla sin esto cuando hay Firebase + nueva arquitectura.
3. **`UIBackgroundModes: ["remote-notification"]`** (#3) — push en background no funciona sin esto.
4. **Bug `platform: 'android'` hardcoded en `useNotifications.ts:26`** (#4) — afecta segmentación de push en producción de forma silenciosa.
5. **Privacy Manifest verificado** (#9) — App Store rechaza el upload sin manifest correcto desde mayo 2024.
6. **Permisos `Info.plist` con purpose strings específicos** (#2) — sin esto Apple rechaza en review por Guideline 5.1.1.

Casi todos los cambios son de configuración nativa, cuentas externas y un fix puntual de un bug. **La única excepción es #10**, que requiere endpoint nuevo en backend + UI nueva en `MenuAccount.tsx`.

> **Nota sobre Sign in with Apple:** la Guideline 4.8 de App Store **no aplica** a esta app. La regla obliga a ofrecer Sign in with Apple solo cuando el login con un proveedor social (Google, Facebook, etc.) es el **método exclusivo** de autenticación. Fabricante Directo tiene su propio sistema de cuenta (`(auth)/login.tsx`, `registro.tsx`, `recuperar-password.tsx`, `verificar-cuenta.tsx`) con email/password y Google es solo una opción adicional — esto cae dentro de las exenciones explícitas de Apple.

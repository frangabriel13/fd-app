# 📱 Reporte: Deploy a iOS de Fabricante Directo

## ❌ Veredicto: **NO se puede deployar tal como está. Requiere cambios obligatorios.**

La app fue construida exclusivamente para Android (Google Play). Tiene configuración básica de iOS en `app.json` (solo `bundleIdentifier`) pero le faltan piezas críticas para compilar y funcionar correctamente en iOS.

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
**Qué:** La app usa cámara, galería de fotos y video (expo-image-picker, expo-av, subida de logos/productos). iOS **rechaza** builds sin textos de uso declarados — y Apple rechaza en review si los mensajes son genéricos.

**Por qué:** App Store Review Guideline 5.1.1 — Purpose strings obligatorios.

**Acción:** Agregar en `app.json` → `ios`:
```json
"infoPlist": {
  "NSCameraUsageDescription": "Necesitamos acceso a la cámara para que puedas tomar fotos de tus productos, logo y documentos de verificación.",
  "NSPhotoLibraryUsageDescription": "Necesitamos acceso a tus fotos para que puedas seleccionar imágenes de productos, logo y documentos.",
  "NSPhotoLibraryAddUsageDescription": "Necesitamos guardar imágenes en tu galería.",
  "NSMicrophoneUsageDescription": "Necesitamos acceso al micrófono para grabar videos de productos.",
  "ITSAppUsesNonExemptEncryption": false
}
```
> Nota: el último flag evita el prompt de export compliance en cada build.

### 3. Notificaciones Push (APNs)
**Qué:** iOS no usa FCM directamente, usa APNs. Firebase Messaging en iOS necesita:
- Certificado/key APNs subido a Firebase Console.
- Capability "Push Notifications" + "Background Modes → Remote notifications" habilitados.
- Plugin `expo-build-properties` o config con entitlements.

**Por qué:** Sin esto, los tokens FCM en iOS no se generan y las notificaciones nunca llegan.

**Acción:**
- En Apple Developer Portal: crear APNs Auth Key (.p8), subirla a Firebase → Project Settings → Cloud Messaging → iOS.
- Agregar al `app.json`:
```json
"ios": {
  "bundleIdentifier": "com.fabricantedirecto.fdapp",
  "supportsTablet": true,
  "entitlements": {
    "aps-environment": "production"
  }
}
```
- Habilitar Push Notifications capability en el provisioning profile (EAS lo puede hacer automático).

### 4. Google Sign-In iOS
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

### 5. `eas.json` — perfil de submit iOS
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

### 6. Scripts de build iOS en `package.json`
**Qué:** No existen `build:ios` ni `submit:ios`.

**Acción:** Agregar:
```json
"build:ios": "npx eas build --platform ios --profile production",
"submit:ios": "npx eas submit --platform ios --profile production"
```

### 7. Cuentas y programa de Apple Developer
**Qué:** No es un cambio de código, pero es bloqueante:
- **Apple Developer Program**: USD 99/año.
- **App Store Connect**: crear la ficha de la app con bundle id `com.fabricantedirecto.fdapp`.
- Sin estos no hay deploy posible — EAS los necesita para firmar y subir.

---

## 🟡 Cambios RECOMENDADOS (no bloquean pero evitan rechazo o problemas)

### 8. Icono adaptativo y splash iOS
- `assets/images/icon.png` debe ser 1024×1024 **sin transparencia** ni bordes redondeados (iOS los aplica solo).
- Verificar que `splash-icon.png` se ve bien sobre fondo blanco — iOS no usa `adaptiveIcon` (eso es solo Android).

### 9. `expo-av` está deprecado
**Qué:** `package.json` usa `expo-av` para video. En Expo SDK 53+ recomienda migrar a `expo-video`. Para App Store review esto no importa, pero `expo-av` puede dar warnings en iOS con la nueva arquitectura (`newArchEnabled: true`).

**Acción (opcional):** Migrar `components/createProduct/SelectVideo.tsx` a `expo-video`.

### 10. Política de privacidad y términos
**Qué:** Ya tenés `PRIVACY_POLICY.md` y `TERMS_OF_SERVICE.md`. Apple **exige** URLs públicas para ambos en la ficha de App Store Connect, y una declaración de Privacy Manifest (iOS 17+).

**Acción:** Publicar los documentos en un dominio accesible y completar en App Store Connect:
- Privacy Policy URL
- Support URL
- Marketing URL (opcional)
- Privacy Manifest (`PrivacyInfo.xcprivacy`) declarando uso de APIs como `UserDefaults`, `FileTimestamp`, etc. — Expo lo genera automático pero verificalo.

### 11. IAP / compras (solo si aplica)
Si la app tiene suscripciones de pago (veo `subscriptions` en el user slice), Apple exige usar **StoreKit / In-App Purchase** — no pasarelas externas. Si las suscripciones se pagan fuera de la app (flujo B2B con factura), es aceptable pero hay que documentarlo claramente en el review notes.

### 12. LAN IP hardcodeada
`constants/ApiConfig.ts` tiene `192.168.1.43` hardcoded para dev. No afecta prod, pero conviene leerla de `process.env` o `expo-constants` para que el equipo iOS no pise el valor de Android.

---

## 📋 Pasos para deploy a iOS (una vez hechos los cambios obligatorios)

1. **Alta en Apple Developer Program** (USD 99/año) — [developer.apple.com](https://developer.apple.com).
2. **Crear App en App Store Connect** con bundle id `com.fabricantedirecto.fdapp`.
3. **Firebase Console**: agregar app iOS → descargar `GoogleService-Info.plist`.
4. **APNs**: crear Auth Key (.p8) en Apple Developer → subir a Firebase Cloud Messaging.
5. **Google Cloud Console**: crear OAuth Client ID para iOS.
6. Aplicar cambios 1–7 de la sección obligatoria.
7. `npx eas credentials` → configurar credenciales iOS (EAS las puede generar automático).
8. `npm run build:ios` → genera el `.ipa`.
9. `npm run submit:ios` → sube a TestFlight.
10. Probar en TestFlight con usuarios internos.
11. Enviar para review desde App Store Connect (completando ficha: screenshots, descripción, categorías, rating, privacy, etc.).
12. Tiempo típico de review: 24–48 hs.

---

**Resumen:** faltan ~7 cambios de configuración obligatorios (sobre todo Firebase/APNs, permisos Info.plist y Google Sign-In iOS) antes de poder compilar una build válida. Ninguno toca lógica de negocio — son todos de configuración nativa y cuentas externas.

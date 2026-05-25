# Google Sign-In — Setup y Troubleshooting

## Arquitectura: dos proyectos Google Cloud

Esta app usa **dos proyectos Google Cloud distintos**. No es un error de configuración, es así por diseño histórico (el proyecto OAuth se creó manualmente antes de que existiera Firebase en el proyecto).

| Proyecto | Número | Para qué se usa |
|---|---|---|
| (sin nombre Firebase, solo Google Cloud) | `378911157109` | **Google Sign-In (OAuth).** Contiene el OAuth Web Client cuyo ID es el `webClientId` hardcodeado en `config/googleSignIn.ts`, y los OAuth Android Clients con los SHA-1 registrados. El backend valida los `idToken` contra este `webClientId`. |
| `fabricante-directo-853ea` | `588562315509` | **Firebase / FCM (notificaciones push).** Es el proyecto del `google-services.json` que está bundleado en el APK. **No se usa para auth.** Firebase Auth NO está habilitado. |

**Regla clave:** Agregar un SHA-1 en Firebase NO sincroniza al proyecto OAuth. Son dos lugares separados que hay que mantener por separado:
- **Para Google Sign-In** → agregar SHA-1 en proyecto **378911157109** vía Google Cloud Console (APIs & Services → Credentials). No aparece en Firebase Console porque ese proyecto no es Firebase.
- **Para FCM** → agregar SHA-1 en proyecto **588562315509** vía Firebase Console (o Google Cloud Console, son lo mismo).

## OAuth Android Client: una regla clave

Cada OAuth Android Client en Google Cloud Console acepta **UN solo (`package_name` + `SHA-1`)**. Si necesitás registrar varios SHA-1, **creás varios OAuth Android Clients** (no podés agregar múltiples SHA-1 a uno solo).

Al crear un client nuevo:
- **Application type:** Android
- **Package name:** literalmente `com.fabricantedirecto.fdapp` (el `applicationId` real de la app, **NO un nombre arbitrario** — si ponés cualquier otra cosa, Google nunca encuentra match y tira `DEVELOPER_ERROR` silenciosamente)
- **SHA-1:** el del keystore correspondiente
- **Name:** label libre, usalo para identificar a qué keystore corresponde (ej. "Android Play App Signing")

## SHA-1 actuales y para qué sirve cada uno

| Keystore | SHA-1 | Cuándo se usa | OAuth Client en proyecto 378911157109 |
|---|---|---|---|
| Debug local | `5e:8f:16:06:2e:a3:cd:2c:4a:0d:54:78:76:ba:a6:f3:8c:ab:f6:25` | Dev client local en celu/emulador (`npx expo start --android`) | "Cliente de Andorid" |
| Upload key EAS | `27:9e:29:fe:db:c2:74:3b:31:64:9d:3b:3f:9d:ea:c0:5a:00:17:b4` | APK firmado por EAS instalado directo (sin pasar por Play Store) | "Andorid Production" |
| Google Play App Signing | `0C:6E:E7:7C:9B:86:04:EB:B0:49:7D:0B:2C:45:F0:5C:51:10:3C:B9` | App descargada del Play Store (test interno, cerrado, producción) | "Android Play App Signing" |

Cada uno tiene que tener su OAuth Android Client correspondiente en el proyecto 378911157109. Si falta alguno, Google Sign-In rompe **solo en el escenario donde se usa ese keystore**.

## Troubleshooting

### `DEVELOPER_ERROR` después de subir un nuevo build a Play Store

**Síntomas:** Google Sign-In funcionaba con builds firmados con el upload key (instalación directa del APK de EAS), pero al instalar desde Play Store (test interno/cerrado/producción) tira `DEVELOPER_ERROR`.

**Causa:** Google Play **re-firma** el APK con su propio "App signing key" (programa Play App Signing, obligatorio para apps nuevas desde 2021). El SHA-1 efectivo de la app distribuida es el del App Signing key, **NO** el del upload key de EAS. Si ese SHA-1 no está registrado como OAuth Android Client en el proyecto 378911157109, Google Sign-In falla.

**Fix:**

1. **Obtener el SHA-1 del App Signing key** desde Play Console:
   - URL directa: `https://play.google.com/console/u/0/developers/<DEV_ID>/app/<APP_ID>/keymanagement`
   - O navegar buscando "App integrity" / "Integridad de la app" / "App signing"
   - Sección **"App signing key certificate"** → copiar el SHA-1

2. **Crear OAuth Android Client nuevo** en Google Cloud Console:
   - Proyecto **378911157109** → APIs & Services → Credentials
   - **+ CREATE CREDENTIALS** → OAuth client ID
   - Application type: **Android**
   - Name: algo descriptivo (ej. "Android Play App Signing")
   - Package name: `com.fabricantedirecto.fdapp` (exacto)
   - SHA-1: el copiado del paso 1
   - **CREATE**

3. **Esperar 5-30 minutos** para que Google propague (a veces es rápido, a veces tarda)

4. **Limpiar cache en el dispositivo** (acelera el efecto):
   - Settings → Apps → Fabricante Directo → Storage → Clear cache (o desinstalar/reinstalar)
   - Settings → Apps → Google Play Services → Storage → Clear cache (NO clear data)

5. **Probar Google Sign-In**

### `DEVELOPER_ERROR` en builds de EAS instalados directamente (sin Play Store)

Causa probable: EAS regeneró el upload keystore. Verificar con:

```bash
eas credentials
# Android → production → Keystore: Manage everything → buscar opción de "print" (NO "Set up a new keystore")
```

Si el SHA-1 actual de EAS no coincide con `27:9e:...` (el de "Andorid Production"), repetir el flujo de creación de OAuth Android Client con el nuevo SHA-1.

**Importante:** evitá regenerar el upload keystore si no tenés razón. Cada rotación obliga a registrar el nuevo SHA-1 acá Y a coordinar el cambio en Play Console.

### `Sign in failed` (no `DEVELOPER_ERROR`)

Generalmente significa que el `webClientId` en `config/googleSignIn.ts` está mal o el backend rechaza el token. Verificar:
- Que `webClientId` en `config/googleSignIn.ts` esté completo y sin typos
- Que el backend valide el `idToken` con ese mismo `webClientId` como audience
- Que el backend pueda alcanzar Google (no haya problemas de red)

### `Play Services not available`

El dispositivo o emulador no tiene Google Play Services. Probar en otro dispositivo con Play Services instalado.

## Notas de mantenimiento

- **No tocar `config/googleSignIn.ts` `webClientId`** sin coordinar cambio en el backend. Migrar a otro `webClientId` implica re-deploy coordinado de app + backend.
- **No borrar OAuth Android Clients existentes** salvo que estés seguro de que el SHA-1 ya no se usa.
- **No regenerar el upload keystore de EAS** salvo emergencia.
- **Backup del keystore local** (`android/app/fd-release.jks`): si lo perdés, no podés volver a publicar updates con la misma firma. Tenelo guardado fuera del repo.

## Setup inicial (referencia histórica)

Esta sección documenta cómo se configuró Google Sign-In originalmente. Si estás haciendo el setup desde cero en otro proyecto, seguí estos pasos. Si estás manteniendo este proyecto, **leé las secciones de arriba primero** — es muy raro que necesites tocar esto.

### 1. Habilitar la API de Google Sign-In en Google Cloud Console
- Crear proyecto en https://console.cloud.google.com
- APIs & Services → Library → habilitar **Google Sign-In API**

### 2. Crear OAuth Web Client (para el `webClientId`)
- APIs & Services → Credentials → + CREATE CREDENTIALS → OAuth client ID
- Application type: **Web application**
- Name: algo descriptivo (ej. `fabricanteDIrecto`)
- Guardar el **Client ID** generado → este es el `webClientId` que va en `config/googleSignIn.ts`

### 3. Crear OAuth Android Clients (uno por cada SHA-1)
Ver sección "OAuth Android Client: una regla clave" arriba.

### 4. Configurar `config/googleSignIn.ts`
```typescript
GoogleSignin.configure({
  webClientId: '378911157109-9n1bjfra29k7uv3qr78tdmdoaffja56b.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  scopes: ['profile', 'email'],
});
```

### 5. Setup en el backend
El backend tiene que validar el `idToken` recibido del cliente usando el mismo `webClientId` como audience. Ver el código del backend para detalles específicos.

## Comandos útiles

```bash
# Ver SHA-1 del debug keystore local
cd android && ./gradlew signingReport

# Ver SHA-1 del upload key de EAS
eas credentials
# → Android → production → Keystore: Manage everything → Print keystore credentials
```

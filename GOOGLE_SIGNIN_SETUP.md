# Configuración de Google Sign-In para Android

## Información necesaria para Google Console:

### Para tu aplicación Android:
- **Package Name**: `com.fabricantedirecto.fdapp`
- **SHA-1 Certificate Fingerprint**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

## Pasos para configurar en Google Cloud Console:

### 1. Crear/Configurar proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Sign-In

### 2. Crear credenciales OAuth 2.0
1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Selecciona **Android** como Application type
4. Completa los campos:
   - **Name**: `fd-app Android`
   - **Package name**: `com.fabricantedirecto.fdapp`
   - **SHA-1 certificate fingerprint**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

### 3. Crear credencial Web (necesaria para el funcionamiento)
1. Crea otro **OAuth client ID**
2. Selecciona **Web application**
3. Dale un nombre como `fd-app Web`
4. **IMPORTANTE**: Copia el **Client ID** que se genera (termina en `.apps.googleusercontent.com`)

### 4. Configurar el archivo de configuración
1. Abre el archivo `config/googleSignIn.ts`
2. Reemplaza `TU_WEB_CLIENT_ID_AQUI` con tu Web Client ID real
3. Ejemplo:
   ```typescript
   webClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
   ```

### 5. Descargar google-services.json (Opcional pero recomendado)
1. En Google Cloud Console, ve a **Project Settings**
2. En la sección **Your apps**, haz clic en el ícono de Android
3. Descarga el archivo `google-services.json`
4. Colócalo en `android/app/google-services.json` (ya existe uno)

## Comandos para generar nuevos SHA-1 (si necesario):
```bash
# Para debug keystore (desarrollo)
cd android && ./gradlew signingReport

# Para release keystore (producción)
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

## Verificación:
1. Asegúrate de que el archivo `google-services.json` esté en `android/app/`
2. Verifica que el `webClientId` esté configurado en `config/googleSignIn.ts`
3. Ejecuta la aplicación y prueba el botón de Google Sign-In

## Troubleshooting:
- Si aparece error "Developer Error", verifica que el SHA-1 sea correcto
- Si aparece "Sign in failed", verifica el webClientId
- Si aparece "Play Services not available", asegúrate de tener Google Play Services en el emulador

## Nota:
El archivo `google-services.json` actual puede no estar configurado para tu proyecto específico. Asegúrate de descargar y usar el correcto desde tu proyecto en Google Cloud Console.

# Configuración de Google Cloud Console para AuthSession

Para que tu autenticación con Google funcione correctamente con AuthSession de Expo, necesitas seguir estos pasos:

## 1. Ir a Google Cloud Console
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Selecciona tu proyecto existente

## 2. Configurar Client ID de tipo Web

### Para tu Client ID Web existente:
`378911157109-9n1bjfra29k7uv3qr78tdmdoaffja56b.apps.googleusercontent.com`

1. Ve a **APIs y servicios > Credenciales**
2. Busca tu Client ID de tipo **Web**
3. Haz clic en editar (ícono de lápiz)

### 3. Configurar Redirect URIs autorizados

Agrega estos URIs EXACTOS en la sección "URIs de redirección autorizados":

**Para desarrollo y producción:**
```
https://auth.expo.io/@frangabriel.13/fd-app
```

**Para desarrollo web local (opcional):**
```
http://localhost:19006
```

**NOTA IMPORTANTE:** Google no acepta esquemas personalizados como `fdapp://` en Client IDs de tipo Web. Expo manejará automáticamente el redirect.

## 4. NO necesitas:
- ❌ SHA-1 fingerprints (eso es solo para SDK nativo)
- ❌ Client ID de Android (ya no lo usaremos)
- ❌ Configuración de paquete Android

## 5. Verificar configuración

Tu configuración debería verse así:

**Tipo**: Web application
**Nombre**: Puede ser cualquiera (ej: "FD App Web Client")
**URIs de redirección autorizados**:
- `https://auth.expo.io/@frangabriel.13/fd-app` (para desarrollo y producción)
- `http://localhost:19006` (opcional, para desarrollo web)

## 6. Probar

Una vez configurado:
1. Guarda los cambios en Google Cloud Console
2. Espera unos minutos para que se propaguen los cambios
3. Prueba el login con Google en tu app

## Debugging

Si tienes problemas, revisa en los logs de la consola:
- El redirect URI que se está generando
- Los errores específicos de OAuth

El redirect URI se mostrará en console.log cuando uses la función useGoogleAuth().

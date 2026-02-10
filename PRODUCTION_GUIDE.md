# Fabricante Directo - Guía de Producción 🚀

Esta guía te ayudará a preparar y subir tu app **Fabricante Directo** a Google Play Store.

## ✅ Estado Actual de la Configuración

Tu app ya está **configurada para producción** con:

- ✅ **app.json** optimizado para Google Play Store
- ✅ **eas.json** configurado para builds de producción
- ✅ **Package.json** con scripts de build
- ✅ **Política de Privacidad** completa
- ✅ **Términos de Servicio** completos
- ✅ **Información para Google Play Store** detallada

## 🔧 Próximos Pasos

### 1. Resolver problema de npm registry (temporal)
```bash
# Cuando se resuelva, instalar EAS CLI:
npm install -g @expo/eas-cli

# O usar el script automático:
./setup-production.bat   # En Windows
./setup-production.sh    # En Linux/Mac
```

### 2. Construir la app para producción

```bash
# Iniciar sesión en EAS
eas login

# Construir AAB para Google Play Store  
npm run build:android

# O directamente:
eas build --platform android --profile production
```

### 3. Completar Play Store Console

1. **Assets gráficos**: Crear según especificaciones en `GOOGLE_PLAY_STORE_INFO.md`
2. **Capturas de pantalla**: Tomar screenshots de la app funcionando
3. **Descripción**: Usar texto preparado en `GOOGLE_PLAY_STORE_INFO.md`
4. **Política de privacidad**: Subir `PRIVACY_POLICY.md` a tu sitio web

### 4. Testing y Publicación

1. **Testing interno** → **Testing cerrado** → **Producción**
2. Subir el archivo `.aab` generado por EAS Build
3. Completar información requerida por Google Play Console

## 📁 Archivos Importantes Creados

| Archivo | Propósito |
|---------|-----------|
| `PRIVACY_POLICY.md` | Política de privacidad para Google Play Store |
| `TERMS_OF_SERVICE.md` | Términos de servicio legales |
| `GOOGLE_PLAY_STORE_INFO.md` | Guía completa para configurar la store |
| `setup-production.bat/.sh` | Scripts de configuración automática |

## ⚙️ Configuración Técnica

### App.json - Configuraciones Clave
```json
{
  "name": "Fabricante Directo",
  "android": {
    "package": "com.fabricantedirecto.fdapp",
    "versionCode": 1,
    "permissions": ["CAMERA", "READ_EXTERNAL_STORAGE", ...]
  }
}
```

### EAS.json - Profiles de Build
```json
{
  "production": {
    "android": {
      "buildType": "aab"  // App Bundle para Google Play Store
    }
  }
}
```

### Scripts de Package.json
```bash
npm run build:android      # Build de producción
npm run build:preview      # Build para testing  
npm run submit:android     # Submit automático a store
npm run build:submit       # Build + Submit en un comando
```

## 🎯 Checklist de Publicación

### Pre-build
- [ ] Información de contacto actualizada en policies
- [ ] Version y versionCode correctos en app.json
- [ ] Assets de iconos optimizados (512x512)
- [ ] Permisos revisados y justificados

### Build
- [ ] EAS CLI instalado y configurado
- [ ] Build de producción completado exitosamente
- [ ] Archivo .aab descargado

### Google Play Console  
- [ ] App creada en Play Console
- [ ] Información básica completada
- [ ] Capturas de pantalla subidas (mínimo 2)
- [ ] Feature graphic creado (1024x500)
- [ ] Descripción corta y completa agregadas
- [ ] Categoría seleccionada (Negocios)
- [ ] Clasificación de contenido completada
- [ ] Política de privacidad enlazada
- [ ] Email de soporte configurado

### Testing
- [ ] Testing interno configurado  
- [ ] Testers agregados y app funcional
- [ ] Feedback revisado y bugs corregidos

### Publicación
- [ ] Testing cerrado (opcional pero recomendado)
- [ ] Review de Google Play completado
- [ ] App publicada en producción

## 🚨 Problemas Comunes y Soluciones

### Error de npm registry
**Problema**: `npm ERR! 404 Not Found - GET https://registry.npmjs.org/@expo%2feas-cli`  
**Solución**: 
```bash
npm cache clean --force
npm config set registry https://registry.npmjs.org/
```

### Build fallido
**Problema**: Error durante `eas build`  
**Solución**: 
- Verificar que todas las dependencias estén actualizadas
- Revisar logs detallados en EAS dashboard
- Asegurar que app.json esté bien formateado

### Rechazo de Google Play
**Problemas comunes**:
- Política de privacidad no accesible
- Permisos sin justificación clara  
- Descripciones que faltan
- Capturas de pantalla de baja calidad

## 📞 Soporte

Si necesitas ayuda:

1. **Documentación Expo EAS**: https://docs.expo.dev/eas/
2. **Google Play Console Help**: https://support.google.com/googleplay/android-developer/
3. **Logs de builds**: Disponibles en https://expo.dev/ (en tu dashboard)

---

## 🎉 ¡Listo para Google Play Store!

Tu app **Fabricante Directo** está preparada para ser publicada. Solo necesitas resolver el issue temporal de npm registry y ejecutar los builds.

**¡Mucho éxito con tu lanzamiento! 🚀**
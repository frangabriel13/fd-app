@echo off
REM Script para Windows - Configurar EAS CLI y preparar para producción
REM Ejecutar cuando el problema de npm registry esté resuelto

echo 🚀 Configurando Fabricante Directo para producción...
echo.

echo 📦 Paso 1: Instalando EAS CLI...
call npm install -g @expo/eas-cli
echo.

echo 🔑 Paso 2: Iniciando sesión en EAS...
echo ⚠️  Necesitarás tu cuenta de Expo para continuar
call eas login
echo.

echo ⚙️  Paso 3: Configurando proyecto EAS...
echo El archivo eas.json ya está configurado, verificando...
call eas build:configure --platform android
echo.

echo 🏗️  Paso 4: ¿Construir versión de producción ahora?
echo ⚠️  Este paso puede tomar 10-20 minutos
echo.
set /p response="¿Continuar con el build? (y/n): "
if /i "%response%"=="y" goto :build
if /i "%response%"=="yes" goto :build
goto :skip

:build
echo Iniciando build de producción...
call eas build --platform android --profile production
goto :end

:skip
echo Build cancelado. Puedes ejecutarlo más tarde con:
echo eas build --platform android --profile production
echo.

:end
echo ✅ Configuración completada!
echo.
echo 📋 Próximos pasos:
echo 1. Una vez que tengas el archivo .aab, súbelo a Google Play Console
echo 2. Completa la información usando GOOGLE_PLAY_STORE_INFO.md
echo 3. Configura testing interno primero
echo 4. Después de testear, publica en producción
echo.
echo 📁 Archivos importantes creados:
echo    • PRIVACY_POLICY.md
echo    • TERMS_OF_SERVICE.md  
echo    • GOOGLE_PLAY_STORE_INFO.md
echo.
echo 🎉 ¡Tu app está lista para Google Play Store!
echo.
pause
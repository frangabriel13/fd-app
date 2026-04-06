#!/bin/bash

# Script para configurar EAS CLI y preparar la aplicación para producción
# Ejecutar cuando el problema de npm registry esté resuelto

echo "🚀 Configurando Fabricante Directo para producción..."

echo ""
echo "📦 Paso 1: Instalando EAS CLI..."
npm install -g @expo/eas-cli

echo ""
echo "🔑 Paso 2: Iniciando sesión en EAS..."
echo "⚠️  Necesitarás tu cuenta de Expo para continuar"
eas login

echo ""
echo "⚙️  Paso 3: Configurando proyecto EAS..."
echo "El archivo eas.json ya está configurado, pero verificaremos la configuración..."
eas build:configure --platform android

echo ""
echo "🏗️  Paso 4: Construir versión de producción..."
echo "⚠️  Este paso puede tomar 10-20 minutos"
echo "¿Quieres continuar con el build? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]
then
    echo "Iniciando build de producción..."
    eas build --platform android --profile production
else
    echo "Build cancelado. Puedes ejecutarlo más tarde con:"
    echo "eas build --platform android --profile production"
fi

echo ""  
echo "✅ Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Una vez que tengas el archivo .aab, súbelo a Google Play Console"
echo "2. Completa la información de la store usando GOOGLE_PLAY_STORE_INFO.md"
echo "3. Configura el testing interno primero"
echo "4. Después de testear, publica en producción"
echo ""
echo "📁 Archivos importantes creados:"
echo "   • PRIVACY_POLICY.md - Para Google Play Store"
echo "   • TERMS_OF_SERVICE.md - Para Google Play Store"
echo "   • GOOGLE_PLAY_STORE_INFO.md - Guía completa para la store"
echo ""
echo "🎉 ¡Tu app está lista para Google Play Store!"
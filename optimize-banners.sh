#!/bin/bash

# Script para optimizar imágenes de banners que están causando errores de build
echo "🖼️  Optimizando banners para Android build..."

cd assets/images/sliders

# Crear backup
echo "📋 Creando backup..."
mkdir -p backup
cp banner*.png backup/

echo ""
echo "📏 Tamaños originales:"
ls -lh banner*.png

echo ""
echo "⚠️  INSTRUCCIONES MANUALES:"
echo "1. Ve a https://tinypng.com/"
echo "2. Sube banner1.png, banner2.png, banner3.png, banner4.png"
echo "3. Descarga las versiones comprimidas"
echo "4. Reemplaza los archivos originales"
echo ""
echo "🎯 OBJETIVO: < 100KB por imagen"
echo ""
echo "💡 Alternativamente, usa herramientas locales:"
echo "   - Photoshop: Save for Web (JPG Quality 70-80%)"
echo "   - GIMP: Export (JPG Quality 75%)"
echo "   - Cambiar de PNG a JPG si no necesitas transparencia"
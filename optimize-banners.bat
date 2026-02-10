@echo off
echo 🖼️  Optimizando banners para Android build...

cd assets\images\sliders

echo 📋 Creando backup...
if not exist backup mkdir backup
copy banner*.png backup\

echo.
echo 📏 Tamaños actuales:
dir banner*.png

echo.
echo ⚠️  ACCIÓN REQUERIDA:
echo 1. Ve a https://tinypng.com/
echo 2. Sube banner1.png, banner2.png, banner3.png, banner4.png
echo 3. Descarga las versiones comprimidas (debería reducir 60-70%%)
echo 4. Reemplaza los archivos originales
echo.
echo 🎯 OBJETIVO: Menos de 100KB por imagen
echo.
echo 💡 ALTERNATIVAS:
echo    - Cambiar a formato JPG (mejor compresión para fotos)
echo    - Reducir resolución si es muy alta
echo    - Usar Photoshop/GIMP "Save for Web"
echo.
echo 📱 Después de optimizar, ejecuta: eas build --platform android --profile production
pause
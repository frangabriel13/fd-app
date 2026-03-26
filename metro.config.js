// Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// module.exports = config;
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Añadir configuración para resolver el alias @
config.resolver.alias = {
  '@': __dirname,
};

// Excluir directorios sin permisos del file watcher
config.watchFolders = (config.watchFolders || []);
config.resolver.blockList = [
  /\.claude\/.*/,
  /\.agents\/.*/,
];

module.exports = withNativeWind(config, { input: './app/global.css' });

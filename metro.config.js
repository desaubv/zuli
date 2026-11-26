
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Habilitar archivos WebAssembly
if (!config.resolver.assetExts.includes('wasm')) {
    config.resolver.assetExts.push('wasm');
}

// Habilitar package exports
config.resolver.unstable_enablePackageExports = true;

module.exports = config;

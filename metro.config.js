const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Allow Metro to resolve ESM packages like Firebase v10+
// config.resolver.unstable_enablePackageExports = true;
// config.resolver.unstable_conditionNames = ['require', 'default'];

module.exports = config;

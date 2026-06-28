const env = require("react-native-dotenv");

module.exports = function(api) {
  api.cache(true);
  api.cache(true);
  return {
    presets: [["babel-preset-expo", {
      jsxImportSource: "nativewind",
      unstable_transformProfile: "hermes-v0",
    }], "nativewind/babel"],
    plugins: [[
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ], 'react-native-reanimated/plugin', [
      'transform-remove-console', // Add this plugin
      { exclude: ['error', 'warn'] } // Keep `console.error` and `console.warn` if needed
    ], ["module-resolver", {
      root: ["./"],

      alias: {
        "@": "./",
        "tailwind.config": "./tailwind.config.js"
      }
    }]],
  };
};

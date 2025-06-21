const webpack = require('webpack');

module.exports = function override(config) {
  // Add polyfills for Node.js core modules
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert/"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url/"),
    "buffer": require.resolve("buffer/"),
    "util": require.resolve("util/"),
  });
  config.resolve.fallback = fallback;

  // Add plugins to provide global variables
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  // Ignore source map warnings for specific packages
  config.ignoreWarnings = [/Failed to parse source map/];
  
  // Add alias for process
  config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'process': 'process/browser'
  };

  return config;
};
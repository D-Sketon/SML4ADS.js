// config-overrides.js
const {
  override,
  addLessLoader,
  adjustStyleLoaders,
  addPostcssPlugins,
} = require("customize-cra");

module.exports = {
  webpack: override(
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
      },
    }),
    adjustStyleLoaders(({ use: [, , postcss] }) => {
      const postcssOptions = postcss.options;
      postcss.options = { postcssOptions };
    }),
    addPostcssPlugins([
      require('tailwindcss'),
      require('autoprefixer')
    ])
  ),
};

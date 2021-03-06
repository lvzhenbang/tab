const path = require('path');
const HtmlWepbkPlugin = require('html-webpack-plugin');

module.exports = (mode) => {
  const isDev = (mode === 'development');
  return {
    mode,
    entry: ['./src/index.js'],
    output: {
      filename: isDev ? 'tab.js' : 'tab.min.js',
      path: path.join(__dirname, 'dist'),
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: [
      new HtmlWepbkPlugin({
        template: path.join(__dirname, 'tpl', 'index.html'),
        filename: 'index.html',
      }),
      new HtmlWepbkPlugin({
        template: path.join(__dirname, 'tpl', 'vertical.html'),
        filename: 'vertical.html',
      }),
    ],
    devtool: isDev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
  };
};

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { name, version } = require('../package.json');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'index.js',
      clean: true
    },
    resolve: {
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    firefox: '60'
                  },
                  useBuiltIns: 'usage',
                  corejs: 3
                }]
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'manifest.json', to: '.' },
          { from: 'bootstrap.js', to: '.' }, // Add bootstrap.js to the output
          { from: 'resources', to: 'resources' },
          { from: 'locale', to: 'locale' }
        ]
      }),
      ...(isDevelopment ? [] : [
        new ZipPlugin({
          filename: `${name}-${version}`,
          extension: 'xpi',
          path: '../'
        })
      ])
    ],
    devtool: isDevelopment ? 'inline-source-map' : false,
    performance: {
      hints: false
    },
    stats: {
      colors: true
    },
    watch: isDevelopment
  };
};
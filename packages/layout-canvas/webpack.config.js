/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = function (_env, argv) {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;

  return {
    devtool: isDevelopment && 'cheap-module-source-map',
    entry: {
      'm-one-layout-canvas': './src/index.ts',
    },
    output: {
      filename: 'assets/js/[name].[contenthash].js',
      library: '[name]',
      libraryTarget: 'commonjs',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              // Skip type-checking in dev for faster rebuilds; build still enforces full TS errors.
              transpileOnly: isDevelopment,
            },
          },
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              envName: isProduction ? 'production' : 'development',
            },
          },
        },
        {
          test: /\.css$/,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.html$/,
          use: 'raw-loader',
        },
        {
          test: /\.txt$/,
          use: 'raw-loader',
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'static/media/[name].[contenthash].[ext]',
            },
          },
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[contenthash].[ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      isProduction &&
        new MiniCssExtractPlugin({
          filename: 'assets/css/[name].[contenthash].css',
          chunkFilename: 'assets/css/[name].[contenthash].chunk.css',
        }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              comparisons: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              comments: false,
              ascii_only: true,
            },
            warnings: false,
          },
        }),
        new CssMinimizerPlugin(),
      ],

      runtimeChunk: 'single',
    },
    devServer: {
      compress: true,
      historyApiFallback: true,
      open: true,
      overlay: true,
    },
    externals: {
      react: 'react',
      'react-dom': 'reactDOM',
      '@emotion/react': '@emotion/react',
      '@emotion/styled': '@emotion/styled',
      'prop-types': 'prop-types',
      'lucide-react': 'lucide-react',
      // External all @m-one packages
      ...Object.fromEntries(
        [
          '@m-next/address',
          '@m-next/address-lookup',
          '@m-next/attachments',
          '@m-next/banner',
          '@m-next/bread-crumbs',
          '@m-next/button',
          '@m-next/button-group',
          '@m-next/caption',
          '@m-next/card',
          '@m-next/chart',
          '@m-next/chart-drilldown',
          '@m-next/checkbox',
          '@m-next/chips-filter',
          '@m-next/color-picker',
          '@m-next/container',
          '@m-next/criteria-builder',
          '@m-next/datepicker',
          '@m-next/dialog',
          '@m-next/dropdown',
          '@m-next/expression',
          '@m-next/field-block',
          '@m-next/gallery',
          '@m-next/grid',
          '@m-next/html-editor',
          '@m-next/image',
          '@m-next/input',
          '@m-next/input-area',
          '@m-next/loading-skeleton',
          '@m-next/map',
          '@m-next/menu',
          '@m-next/multi-select',
          '@m-next/phone-input',
          '@m-next/pill',
          '@m-next/popover',
          '@m-next/radio-button',
          '@m-next/runtime-interface',
          '@m-next/search-input',
          '@m-next/select',
          '@m-next/signature',
          '@m-next/stepper',
          '@m-next/styles',
          '@m-next/svg-icon',
          '@m-next/tabs',
          '@m-next/tag-widget',
          '@m-next/text',
          '@m-next/toggle',
          '@m-next/typeography',
          '@m-next/types',
          '@m-next/utilities',
          '@m-next/validation',
        ].map((pkg) => [pkg, pkg]),
      ),
    },
    stats: 'errors-only',
  };
};

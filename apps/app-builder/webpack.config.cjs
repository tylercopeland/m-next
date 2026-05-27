/* eslint-disable import/no-extraneous-dependencies */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = function (_env, argv) {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;

  return {
    ignoreWarnings: [
      /mini-css-extract-plugin[^]*Conflicting order/,
      /Using \/ for division outside of calc\(\) is deprecated/, // Suppress Sass division deprecation warnings
    ],
    devtool: isDevelopment && 'cheap-module-source-map',
    entry: './src/index.js',
    mode: argv.mode === 'production' ? 'production' : 'development',
    output: {
      filename: 'assets/js/[name].[contenthash].js',
      clean: true,
      chunkFilename: 'assets/js/[name].[contenthash].js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      fullySpecified: false,
      byDependency: {
        esm: {
          fullySpecified: false,
        },
      },
      alias: {
        common: path.resolve(__dirname, 'src/common/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true, // Skip type checking in webpack (use editor/CI for that)
                compilerOptions: {
                  skipLibCheck: true, // Skip type checking of declaration files
                },
              },
            },
          ],
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
          test: /\.scss$/,
          use: [
            'style-loader', // Injects styles into DOM
            {
              loader: 'css-loader',
              options: {
                sourceMap: true, // Enable source maps for CSS
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true, // Enable source maps for Sass
                sassOptions: {
                  quietDeps: true, // Suppress deprecation warnings from dependencies
                  silenceDeprecations: ['slash-div'], // Silence specific deprecation warnings
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
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
        {
          test: /\.html$/i,
          use: 'html-loader',
        },
        {
          test: /\.txt$/i, // ✅ Support .txt files as raw strings
          type: 'asset/source',
        },
      ],
    },

    plugins: [
      new webpack.container.ModuleFederationPlugin({
        shared: {
          react: { requiredVersion: '^17.0.2', eager: true, singleton: true },
          'react-dom': { requiredVersion: '^17.0.2', eager: true, singleton: true },
        },
      }),
      new CopyPlugin({
        patterns: [
          { from: 'public/favicon.ico' },
          { from: 'public/spinner.gif' },
          { from: 'public/web.config' },
        ],
        options: {
          concurrency: 100,
        },
      }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: 'assets/css/[name].[contenthash].css',
          chunkFilename: 'assets/css/[name].[contenthash].chunk.css',
        }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: true,
      }),
      new webpack.SourceMapDevToolPlugin({
        noSources: false,
        filename: 'assets/js/[name].[contenthash].js.map',
      }),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
            compress: true,
            mangle: {
              safari10: true,
            },
            warnings: false,
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'all',

        minSize: 0,
        maxInitialRequests: 10,
        maxAsyncRequests: 10,
        cacheGroups: {
          common: {
            minChunks: 2,
            priority: -10,
          },
        },
      },
      runtimeChunk: 'single',
    },
    devServer: {
      compress: true,
      historyApiFallback: true,
      open: true,
      hot: true,
      client: {
        logging: 'info',
        overlay: true,
      },
      port: 31456,
    },
  };
};

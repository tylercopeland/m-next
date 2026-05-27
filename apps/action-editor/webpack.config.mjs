import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseConfig = {
  ignoreWarnings: [
      /Using \/ for division outside of calc\(\) is deprecated/, // Suppress Sass division deprecation warnings
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // Handle both .ts and .tsx files
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Handle both .ts and .tsx files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // Injects styles into DOM
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                quietDeps: true,
                silenceDeprecations: ['slash-div', 'import', 'global-builtin', 'color-functions'],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // Injects styles into DOM
          {
            loader: 'css-loader',
            options: {
              sourceMap: true, // Enable source maps for CSS
            },
          },
        ],
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
        type: 'asset/inline', // Inline fonts as base64 data URLs to avoid path issues when consumed by app-builder
      },
      {
        test: /\.html$/i,
        use: "html-loader",
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', 
              "@babel/preset-react",
            ],
          }
        }
      },
      {
        test: /\.txt$/i,             // ✅ Support .txt files as raw strings
        type: 'asset/source',
      },
    ],
  },
  devtool: 'source-map', // Generate source maps
};

export default [{
  ...baseConfig,
  name: 'for-legacy',
  entry: {
    'actioneditor.for-legacy.min': [
      './src/entrypoint.for-legacy.js',
      './src/styles/actioneditor/actioneditor.scss',
    ]
  },
  output: {
    filename: 'actioneditor.for-legacy.min.js',
    path: path.resolve(__dirname, 'dist-legacy'),
    clean: true,
  },
  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Ensure ES6+ code is transpiled to ES5
          },
        },
      },
    ],
  },
}, {
  ...baseConfig,
  name: 'react-action-editor-wrapper',
  entry: {
    'index': [
      './src/styles/foundation.scss',
      './src/styles/actioneditor/actioneditor.scss',
      './src/angular/old-externals/select.css',
      './src/fonts/iconfontlist.json',
      './src/fonts/method-font/method-font.json',
      './src/index.ts',
    ]
  },
  output: {
    filename: '[name].js',  // Stable filename for reliable imports by app-builder
    library: {
      type: 'commonjs2',  // CommonJS2 preserves all exports (default + named)
    },
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  // module: {
  //   rules: [
  //     ...baseConfig.module.rules,
  //   ],
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // If you have a template, otherwise, it will create one
    }),
    new webpack.ProvidePlugin({
      _: 'underscore',
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 4747,
    open: true,
    devMiddleware: {
      writeToDisk: true, // Enable writing files to disk
    },
  },
  externals: {
    window: 'window',
    console: 'console',
    // UMD externals: map to correct module names for CommonJS/AMD, globals for browser
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
  }
}];

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV !== 'production';

export default {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    module: true,               // ✅ Enables ESM output
    clean: true,
  },
  experiments: {
    outputModule: true,         // ✅ Required for ESM bundles
  },
  mode: isDev ? 'development' : 'production',
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    hot: true, // Enable HMR
    open: true, // Opens browser on start
    historyApiFallback: true, // For React Router
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              jsx: 'react-jsx',
              module: 'ESNext',
              moduleResolution: 'node',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [isDev && 'react-refresh/babel'].filter(Boolean),
            presets: [
              '@babel/preset-env', 
              '@babel/preset-react',
            ]
          },
        },
      },
      {
        test: /\.module\.(scss|sass)$/, // ✅ Enable CSS Modules
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]__[hash:base64:5]", // ✅ Unique class names
              },
              importLoaders: 1,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.txt$/i,             // ✅ Support .txt files as raw strings
        type: 'asset/source',
      },
      {
        test: /\.scss$/, // ✅ Global SCSS (non-module)
        exclude: /\.module\.(scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },  
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    isDev && new ReactRefreshWebpackPlugin(), // Enable only in dev mode
  ].filter(Boolean),
};

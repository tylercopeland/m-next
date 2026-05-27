module.exports = {
  presets: [
    ['@babel/preset-env', { targets: '> 0.5%, not ie 11, iOS >= 12' }],
    '@babel/preset-react',
    '@babel/preset-typescript',
    '@emotion/babel-preset-css-prop',
  ],
  plugins: [['@emotion']],
};

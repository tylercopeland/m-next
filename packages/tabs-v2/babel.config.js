module.exports = {
  presets: [
    ['@babel/preset-env', { targets: '> 0.5%, not ie 11, iOS >= 12' }],
    '@babel/preset-react',
    '@emotion/babel-preset-css-prop',
    '@babel/preset-typescript',
  ],
  plugins: [['@emotion']],
};

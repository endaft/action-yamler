const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      assert: false,
      fs: false,
      http: false,
      https: false,
      net: false,
      os: false,
      path: false,
      tls: false,
      util: false,
    },
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

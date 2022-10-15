const path = require('path');

module.exports = {
  entry: './src/App.js',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
            }
          }
      },
      {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|bmp|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
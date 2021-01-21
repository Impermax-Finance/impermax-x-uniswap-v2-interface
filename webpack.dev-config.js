const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require('dotenv');
dotenv.config();;

module.exports = function(env, argv) {
  return {
    entry: './src/index.tsx',
    mode: 'development',
    devtool: 'eval',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'www/dist/build'),
      publicPath: 'build/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fallback: {
          "crypto": require.resolve('crypto-browserify'),
          "stream": require.resolve("stream-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "https": require.resolve("https-browserify"),
          "http": require.resolve("stream-http"),
          "url": require.resolve("url/")
        },
    },
    module: {
      rules: [
        {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: "ts-loader"
                },
            ]
        },
        {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.DefinePlugin({
        "process.env.MODE": '"development"',
        "process.env.NETWORK": `"${process.env.NETWORK}"`
      }),
      new CopyPlugin({
        patterns: [
          { from: "src/assets", to: "assets" },
        ],
      }),
    ]
  };
};
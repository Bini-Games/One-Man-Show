const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { SourceMapDevToolPlugin } = require("webpack");
const isDev = process.env.NODE_ENV !== "production";

const config = {
  mode: isDev ? "development" : "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "index.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Existential Crisis 5",
      template: "index.html",
      minify: !isDev,
    }),
    new CopyPlugin({
      patterns: [{ from: "assets", to: "assets" }],
    }),
    new SourceMapDevToolPlugin({
      filename: "[file].map",
      include: /^(?!.*node_modules).*/,
      exclude: /node_modules/,
      noSources: true,
    }),
  ],
  devtool: false,
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
    hot: true,
    open: true,
  },
  watchOptions: {
    aggregateTimeout: 200,
    ignored: [
      path.join(__dirname, "node_modules"),
      path.join(__dirname, "dist"),
    ],
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
    moduleIds: "named",
    chunkIds: "named",
    removeAvailableModules: true,
  },
};

module.exports = config;

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 设置输入和输出根目录
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, "src");
const BUILD_PATH = path.resolve(ROOT_PATH, "chrome/popup");

module.exports = {
  /* source-map */
  devtool: "cheap-module-eval-source-map",
  entry: {
    app: "./src/app.js"
  },
  output: {
    path: BUILD_PATH, // 编译到当前目录
    filename: "popup.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 用babel编译jsx和es6
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          presets: ["env", "react", "stage-2"],
          plugins: [
            "transform-runtime",
            [
              "import",
              { libraryName: "antd", libraryDirectory: "es", style: true }
            ]
          ]
        }
      },
      {
        test: /\.less$/,
        loaders: [
          "style-loader",
          "css-loader?sourceMap",
          "less-loader?sourceMap"
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      components: path.resolve(APP_PATH, "./components"),
      utils: path.resolve(APP_PATH, "./utils"),
      libs: path.resolve(APP_PATH, "./libs")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `../popup.html`, //生成的html存放路径，相对于 path
      template: `./src/popup.html`,
      inject: true, //允许插件修改哪些内容，包括head与body
      hash: true //为静态资源生成hash值
    })
  ],
  watch: true
};

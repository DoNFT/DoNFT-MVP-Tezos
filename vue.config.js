const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        util: require.resolve("util"),
        url: require.resolve("url/"),
        path: require.resolve("path"),
        os: require.resolve("os-browserify"),
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        buffer: require.resolve("buffer"),
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    module: {
      rules: [{
        test: /\.svg$/,
        loader: "vue-svg-loader"
      }]
    }
  },
});

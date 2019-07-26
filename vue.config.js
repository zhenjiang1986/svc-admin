"use strict";
const path = require("path");
const appSettings = require("./src/settings.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = appSettings.title || "后台管理系统";

const port = 8081;

module.exports = {
  /** '/' 为默认值 */
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  /**只有在开发环境才检查代码  https://cli.vuejs.org/config/#lintonsave  需要安装dev  @vue/cli-plugin-eslint */
  lintOnSave: process.env.NODE_ENV === "development",
  /** 是否在打包时生成map文件,map文件在出错时,能帮助找到哪一行出错.建议设置成true */
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    /** exlint时是否显示warning和errors */
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    /** 去掉svg的默认行为 */
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace 阻止元素间的空格,减小压缩后的文件大小
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

      //TODO:<zhenjiang> dev tool cleap source map
      //TODO:<zhenjiang> Chunks
  }
};

'use strict'

//这个文件主要是对开发环境和生产环境的一个基本的配置

// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
//引入node.js的path模块，用于操作路径
const path = require('path')
module.exports = {
  //开发环境的基本配置
  dev: {

    // Paths
    //编译输出的二级目录
    assetsSubDirectory: 'static',
    //编译发布的跟目录，可配置成资源服务器域名或cdn域名
    assetsPublicPath: '/',
    //需要使用proxyTable代理的 接口（可跨域）
    proxyTable: {},
    context: [ //代理路径
      '/shopping',
      '/ugc',
      '/v1',
      '/v2',
      '/v3',
      '/v4',
      '/bos',
      '/member',
      '/promotion',
      '/eus',
      '/payapi',
      '/admin',
      '/statis',
      '/img',
    ],
    // Various Dev Server settings
    //开发时的访问域名。可以通过环境变量自己设置
    host: 'localhost', // can be overwritten by process.env.HOST
    //开发时的端口，可以通过环境变量port设定。如果端口被占用了会随机分配一个未被使用的端口号

    //env: require('./dev.env'),

     port: 8084, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    //是否自动打开浏览器
    autoOpenBrowser: true,
    //在浏览器里是否展示错误蒙层
    errorOverlay: true,
    //是否展示错误的通知
    notifyOnErrors: true,
    //这个是webpack-dev-server的watchOption的一个选项，制定webpack检查文件的方式
    //因为webpack使用文件系统去获取文件改变的通知。在有些情况下，这个可能不起作用。列如使用NFC的时候
    //vagrant也会在这方面存在很多问题，在这些情况下，使用poll选项（以轮询的方式去检查文件是否改变），可以设置成true
    //或者具体是数值，制定文件查询的具体时间周期
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    //是否使用Eslint检查代码
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    //如果设置为true，在浏览器中，eslint的错误和警告会以蒙层的方式展示
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    //source maps 的格式
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    //指定是否通过在文件名称后面添加一个查询字符串来创建source map的缓存
    cacheBusting: true,
    //关闭css的source map
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    //html生成的地方
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    //编译生成的文件目路
    assetsRoot: path.resolve(__dirname, '../dist'),
   //编译生成静态文件的目录
    assetsSubDirectory: 'static',
    //编译发布的根目录，可配置为资源服务器域名或者cdn域名
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    //是否开启生产环境的gzip压缩
    productionGzip: false,
    //开启gzip压缩文件的后缀名称
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    //如果这个选项为true的话，那么这会在build后，会在浏览器生成一份bundler报告
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

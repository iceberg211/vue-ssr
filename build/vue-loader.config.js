// const docsLoader=require('./doc-loader')
module.exports = (isDev) => {
  return {
    // 防止vue模板中的对于空格造成
    preserveWhitepace: true,
    // 设置为true，则不会处理.vue中的css文件内容，有利于组件的异步加载
    extractCSS: !isDev,
    // 设置css热重载,需要加载vue-style-loader
    cssModules: {
      //根据路径，文件名，还有截取的5位的内容hash，来作为前缀名
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
      // 将横杠转换成驼峰
      camelCase: true,

    },
    // 在生产环境中关闭热重载,样式热重载
    // hotReload: !isdev,
    // loaders:{
    //   'docs':docsLoader
    // }

    // 在babel解析js之前,使用loader来解析
    // preLoader:{},
    // postLoader:{},
  }

}
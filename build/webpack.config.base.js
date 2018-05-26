const path = require('path')
// const Vueloader = require('vue-loader') 


// 将非js代码打包成一个单独文件,用于提取css
const ExtractTextplugin = require('extract-text-webpack-plugin')

// node process 变量
const isDev = process.env.NODE_ENV === 'development';

// path.join代表拼接当前文件目录
const config = {
  target: 'web',
  entry: path.join(__dirname, '../src/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // css-loader会提取css，然后style-loader会被插入到 html 文件的 <head> 中
        use: ['style-loader', 'css-loader']
      },
      {
        // url包装了fileLoder,设置体积
        test: /\.(gif|jpeg|jpg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'resources/[name]-[hash].[ext]'
            }
          }
        ]
      }
    ]
  }
}

module.exports = config


/**哈希(所有打包的代码的hash都一样)和ChunkHash的区别*/


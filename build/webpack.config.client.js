const path = require('path')
// const Vueloader = require('vue-loader')
const Webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

// 将非js代码打包成一个单独文件,用于提取css
const ExtractTextplugin = require('extract-text-webpack-plugin')

// node process 变量
const isDev = process.env.NODE_ENV === 'development';

const defaltPlugin = [
  new HTMLPlugin(),
  // 生产版本库进行区分,注意'"development"'和分号
  new Webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  })
]

let config;

if (isDev) {
  config = merge(baseConfig, {
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    // source map
    devtool: '#cheap-module-eval-source-map',
    devServer: {
      port: 8000,
      host: '0.0.0.0',
      overlay: {
        error: true,
      },
      // vue-loader-进行了组件热加载
      hot: true
    },
    plugins: defaltPlugin.concat([
      new Webpack.HotModuleReplacementPlugin(),
      // 减少不必要的错误 
      new Webpack.NoEmitOnErrorsPlugin()])
  })

} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../src/index.js'),
      // 分离类库代码
      vendor: ['vue'],
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: ExtractTextplugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              'stylus-loader'
            ]
          })
        }
      ]
    },
    plugins: defaltPlugin.concat([
      new ExtractTextplugin('styles.[contentHash:8].css'),
      // 单独打包webpack的代码
      new Webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      // 来将webpack的打包代码进行提取
      new Webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      })
    ])
  })
}
console.log(config)
module.exports = config

/**哈希(所有打包的代码的hash都一样)和ChunkHash的区别*/


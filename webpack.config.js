const path = require('path')
// const Vueloader = require('vue-loader')
const Webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')

// 将非js代码打包成一个单独文件,用于提取css
const ExtractTextplugin = require('extract-text-webpack-plugin')

// node process 变量
const isDev = process.env.NODE_ENV === 'development';

// path.join代表拼接当前文件目录
const config = {
  target: 'web',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
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
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new Vueloader(),
    new HTMLPlugin(),
    // 生产版本库进行区分,注意'"development"'和分号
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    })
  ]
}
if (isDev) {
  config.module.rules.push({
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
  })
  // source map
  config.devtool = '#cheap-module-eval-source-map',
    config.devServer = {
      port: 8000,
      host: '0.0.0.0',
      overlay: {
        error: true,
      },
      hot: true
    }
  // 热加载
  config.plugins.push(
    // vue-loader-进行了组件热加载
    new Webpack.HotModuleReplacementPlugin(),
    // 减少不必要的错误
    new Webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    // 分离类库代码
    vendor: ['vue'],
  }
  config.module.rules.push({
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
  })
  config.output.filename = '[name].[chunkhash:8].js'
  config.plugins.push(
    new ExtractTextplugin('styles.[contentHash:8].css'),
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // 单独打包webpack的代码
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  )
}


module.exports = config


/**哈希(所有打包的代码的hash都一样)和ChunkHash的区别*/


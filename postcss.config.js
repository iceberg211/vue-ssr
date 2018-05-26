const autoprefixer = require('autoprefixer')

// postcss后处理期，处理less编译过的css，例如加前缀
module.exports = {
  plugins: [autoprefixer]
}
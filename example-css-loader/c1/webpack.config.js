
module.exports = {
  context: `${__dirname}`,
  entry: `./src/`,
  module: {
    loaders: [{
      test: /\.css/,
      // loaders: ['style', 'css']
      loader: 'css',
      query: {
        // root: '.'
        // module: true
      }
    }],
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  }
}
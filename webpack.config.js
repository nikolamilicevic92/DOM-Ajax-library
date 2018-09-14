const config = {
  entry: "./src/main.js",
  output: {
      filename: 'bundle.js',
      path: __dirname + '/'
  },
  mode: 'production'
  // mode: 'development'
};
module.exports = config;
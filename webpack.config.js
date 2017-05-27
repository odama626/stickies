var autoprefixer = require('autoprefixer');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var babelOptions = {
  "presets": [
    "react",
    "es2016"
  ]
};

module.exports = {
  devtool: 'source-map',
	cache: true,
	entry: {
		main: path.resolve(__dirname, 'assets/components/Master/index.tsx'),
		vendor: [
			'react',
			'react-dom',
      'marked',
		]
	},

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

	output: {
		filename: '[name].js',
		chunkFilename: '[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},

	module: {
		rules: [{
      test: /\.ts(x?)$/, exclude: /node_modules/,
        use: [ {
            loader: 'babel-loader', options: babelOptions
          }, {
            loader: 'awesome-typescript-loader'
        } ]
      },
      { 
  test: /\.s(c|a)ss$/, 
  loader: ExtractTextPlugin.extract({
    fallback: "style-loader",
    loader: "css-loader?modules=true&importLoaders=true&localIdentName=[name]__[local]___[hash:base64:5]!typed-css-modules-loader!sass-loader",
  }),
}
    ]},
  plugins: [
    new ExtractTextPlugin("style.css"),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};

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
		main:    './assets/components/Master/index.tsx',
    landing: './assets/components/NodeView/NodeView.tsx',
    Go: './assets/dependencies/go-get.ts'
	/*	vendor: [
			'react',
			'react-dom',
      'marked',
      'gun'
		]
    */
	},

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

	output: {
		filename: '[name].js',
		//chunkFilename: '[chunkhash].js',
		path: path.resolve(__dirname, 'dist/')
	},

	module: {
		rules: [{
      test: /\.ts(x?)$/, exclude: [/node_modules/, /dist/],
        use: [ {
            loader: 'babel-loader', options: babelOptions
          }, {
            loader: 'awesome-typescript-loader'
        } ]
      },
      { 
      test: /\.s(c|a)ss$/, exclude: [/node_modules/, /dist/],
      loader: ExtractTextPlugin.extract({
        fallback: "style-loader",
        loader: "css-loader?modules=true&importLoaders=true&localIdentName=[name]__[local]___[hash:base64:5]!typed-css-modules-loader!sass-loader",
      }),
  }
    ]},
  plugins: [
          new ExtractTextPlugin("[name].style.css"),
         //new webpack.optimize.CommonsChunkPlugin({ async: true, minChunks: 2})
      ]
};
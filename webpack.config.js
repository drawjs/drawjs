const path = require( 'path' )
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )
const CleanWebpackPlugin = require( 'clean-webpack-plugin' )
const BundleAnalyzerPlugin = require( "webpack-bundle-analyzer" ).BundleAnalyzerPlugin

const __DEV__ = process.env.NODE_ENV === 'development'

module.exports = {
	mode : __DEV__ ? 'development' : 'production',
	entry: {
		'draw.js': './src/index.ts',
		// 'cell': './src/model/cell.ts'

		// generate source map for __test__
		'__test__/comprehensive/index.js': './src/__test__/comprehensive/index.js',
	// '__test__/importData/index.js': './src/__test__/importData/index.js',
	},
	output: {
		filename: '[name]',
		path    : path.resolve( __dirname, 'build' )
	},
	devtool: __DEV__ ? 'source-map' : false,
	module : {
		rules: [
			{
				test   : /\.ts?$/,
				use    : 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use : [
					{
						loader : 'url-loader',
						options: {
							limit: 8192
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [
			'.tsx',
			'.ts',
			'.js'
		],
	},
	plugins: [
		new CleanWebpackPlugin( [
			'build'
		] ),
		new CopyWebpackPlugin( [
			{
				from: './src/__test__',
				to  : '__test__'
			},
			{
				from: './src/asset',
				to  : 'asset'
			},
		] ),
	].concat(
		__DEV__ ?
		[] :
		[ 
			// new BundleAnalyzerPlugin() 
		]
	)

}

const path = require( 'path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry: {
		'draw.js': './src/index.ts',
		// 'cell': './src/model/cell.ts'

		// generate source map for __test__
		'__test__/comprehensive/index.js': './src/__test__/comprehensive/index.js',
		// '__test__/importData/index.js': './src/__test__/importData/index.js',
	},
	output: {
		filename: '[name]',
		path: path.resolve( __dirname, 'build' )
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		alias: {
			model: path.resolve( __dirname, './src/model' ),
			shape: path.resolve( __dirname, './src/shape' ),
			util: path.resolve( __dirname, './src/util' ),
			store: path.resolve( __dirname, './src/store' ),
			lib: path.resolve( __dirname, './src/lib' ),
			interface: path.resolve( __dirname, './src/interface' ),
			interaction: path.resolve( __dirname, './src/interaction' ),
			schema: path.resolve( __dirname, './src/schema' ),
			mixin: path.resolve( __dirname, './src/mixin' ),
			shared: path.resolve( __dirname, './src/shared' ),
		},
		extensions: [
			'.tsx',
			'.ts',
			'.js'
		],
	},
	plugins: [
		new CleanWebpackPlugin( [ 'build' ] ),
		new CopyWebpackPlugin( [
			{
				from: './src/__test__',
				to: '__test__'
			},
			{
				from: './src/asset',
				to: 'asset'
			},
		] )
	]

};

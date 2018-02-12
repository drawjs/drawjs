const PATH = require( 'path' )
const gulp = require( "gulp" )
const ts = require( "gulp-typescript" )
const tsProject = ts.createProject( "tsconfig.json" )
const rimraf = require( "rimraf" )
const browserSync = require( 'browser-sync' )
const sourcemaps = require( 'gulp-sourcemaps' )

const distPathStr = 'build'
const distPath = PATH.resolve( __dirname, 'build' )
const srcOtherFilesGlobs = [
	// 'src/**/*.json',
	// 'src/**/*.html',
]
const watchingSrcGlob = 'src/**/*/__test__/**/*'
const serverPath = distPath
const shouldRebuildDist = true

let watcher = undefined
let bs = undefined

function deleteDist() {
	return Promise.resolve( new Promise( ( resolve ) => {
		rimraf( distPath, () => {
			resolve()
		} )
	} ) )
}

function asyncMainTs() {
	return tsProject.src()
		.pipe( sourcemaps.init() )
		.pipe( tsProject() )
		.js
		.pipe( sourcemaps.write( '.', {
			sourceRoot: function( file ) {
					return file.cwd + '/src'
			}
		} ) )
		.pipe( gulp.dest( distPathStr ) )
}

function asyncMainOther() {
	return gulp.src( srcOtherFilesGlobs )
		.pipe( gulp.dest( distPathStr ) )
}

function server() {
	bs = browserSync.create()

	const serverconfig = {
		server: {
			baseDir: serverPath,
			directory: true,
		},
		files: [
			`${serverPath}/**`
		],
		open: false,
		port: 3000
	}

	bs.init( serverconfig )
}

function main() {
	function asyncImplement() {
		asyncMainOther()
		asyncMainTs()
	}
	try {
		if ( shouldRebuildDist ) {
			deleteDist().then( asyncImplement )
		}

		if ( !shouldRebuildDist ) {
			asyncImplement()
		}
	} catch (e) {
		watcher.remove()
		watcher.end()
		watcher = gulp.watch( watchingSrcGlob )
		watcher.on( 'change', main )
	}

}
watcher = gulp.watch( watchingSrcGlob )
watcher.on( 'change', main )


gulp.task( "default", () => {
	main()
	// server()
} )




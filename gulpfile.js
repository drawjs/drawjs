const PATH = require( 'path' )
const gulp = require( "gulp" )
const ts = require( "gulp-typescript" )
const tsProject = ts.createProject( "tsconfig.json" )
const rimraf = require( "rimraf" )
const browserSync = require( 'browser-sync' )

const distPathStr = 'dist'
const distPath = PATH.resolve( __dirname, 'dist' )
const srcOtherFilesGlobs = [
	'src/**/*.json',
	'src/**/*.html',
]
const watchingSrcGlob = 'src/**/*'
const serverPath = distPath
const shouldRebuildDist = false

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
		.pipe( tsProject() )
		.js.pipe( gulp.dest( distPathStr ) )
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
		watcher.close()
		watcher = gulp.watch( watchingSrcGlob, main )
		throw e
	}

}
try {
	watcher = gulp.watch( watchingSrcGlob, main )
} catch (e) {
	console.log( 'watcher error!' )
}


gulp.task( "default", () => {
	main()
	server()
} )




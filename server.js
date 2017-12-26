const browserSync = require( 'browser-sync' )

const bs = browserSync.create()
const serverPath = 'dist'

const serverconfig = {
	server: {
		baseDir: serverPath,
		directory: true,
	},
	files: [
		`${serverPath}/**`
	],
	open: false,
}

bs.init( serverconfig )

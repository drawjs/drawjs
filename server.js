const browserSync = require( 'browser-sync' )

const bs = browserSync.create()
const serverPath = __dirname

const serverconfig = {
	server: {
		baseDir: serverPath,
		directory: true,
	},
	files: [
		`${serverPath}/dist/**`
	],
	open: false,
}


function init() {
	try {
		bs.init( serverconfig )
	} catch( e ) {
		init()
	}
}

init()



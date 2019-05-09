const browserSync = require( 'browser-sync' )

const bs = browserSync.create()
const serverPath = __dirname

const PORT = 8600
const serverconfig = {
	server: {
		baseDir  : serverPath,
		directory: true,
	},
	files: [
		`${serverPath}/build/**`
	],
	port: PORT,
	open: false,
}


function init() {
	try {
		bs.init( serverconfig )
	} catch( e ) {
		init()
	}
}

// console.log( `listening on http://localhost:${PORT}` )

init()



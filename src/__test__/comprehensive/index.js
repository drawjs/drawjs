const draw = new Draw( document.getElementById( 'canvas' ) )

// ******* import *******
const uploadButton = document.getElementById( 'uploadButton' )

uploadButton.onclick = onFileInputClick
uploadButton.onchange = onFileInputChange( callback )

function onFileInputClick() {
    this.value = null
}

function onFileInputChange( callback ) {
    return event => {
        try {
            const reader = new FileReader()
            function onReaderLoad( event ) {
                callback( event.target.result )
            }
            reader.onload = onReaderLoad
            reader.readAsText( event.target.files[ 0 ] )
        } catch ( e ) {

        }
    }
}
function callback( text ) {
    draw.importData( text )
}

// ******* import *******



// ******* export *******
// draw.addElement( 'rect', {
// 	top   : 100,
// 	left  : 100,
// 	fill  : 'red',
// 	width : 100,
// 	height: 100,
// 	angle : 0,
// } )

draw.addElement( 'point', {
	x: 100,
	y: 100,
	color: 'blue',
} )

// draw.addElement( 'point', {
// 	x: 300,
// 	y: 200,
// 	color: 'blue',
// } )


// draw.addElement( 'line', {
// 	pointStart: {
// 		x: 0,
// 		y: 0,
// 	},
// 	pointEnd: {
// 		x: 100,
// 		y: 100
// 	},
// 	fill: 'blue',
// } )

// draw.zoomPan.zoom = 2

draw.render()

document.getElementById( 'exportBtn' ).addEventListener( 'click', function () {
	draw.exportData()
} )

// ******* export *******


// // ******* zoom and pan *******
// document.getElementById( 'zoomInButton' ).addEventListener( 'click', draw.zoomPan._zoomIn.bind( draw.zoomPan ) )
// document.getElementById( 'zoomOutButton' ).addEventListener( 'click', draw.zoomPan._zoomOut.bind( draw.zoomPan ) )

// document.getElementById( 'panTop' ).addEventListener( 'click', draw.zoomPan._panTop.bind( draw.zoomPan ) )
// document.getElementById( 'panBottom' ).addEventListener( 'click', draw.zoomPan._panBottom.bind( draw.zoomPan ) )
// document.getElementById( 'panLeft' ).addEventListener( 'click', draw.zoomPan._panLeft.bind( draw.zoomPan ) )
// document.getElementById( 'panRight' ).addEventListener( 'click', draw.zoomPan._panRight.bind( draw.zoomPan ) )
// // ******* zoom and pan *******

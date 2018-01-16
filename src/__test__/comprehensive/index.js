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
draw.addElement( 'rect', {
	top: 200,
	left: 200,
	fill: 'red',
	width: 100,
	height: 100,
	angle: 45,
} )

// draw.addElement( 'rect', {
// 	top: 300,
// 	left: 300,
// 	fill: 'red',
// 	width: 100,
// 	height: 100,
// 	angle: 0,
// } )


// draw.addElement( {
// 	pointStart: {
// 		x: 200,
// 		y: 200,
// 	},
// 	pointEnd: {
// 		x: 200 + 25,
// 		y: 200 + 43.30127018922195
// 	},
// 	fill: 'blue',
// } )

draw.render()

document.getElementById( 'exportBtn' ).addEventListener( 'click', function () {
	draw.exportData()
} )

// ******* export *******

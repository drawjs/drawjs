const draw = new Draw( document.getElementById( 'canvas' ) )

// ******* import *******
const fileInput = document.getElementById( 'fileInput' )

fileInput.onclick = onFileInputClick
fileInput.onchange = onFileInputChange( callback )

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
function callback() {
    draw.importData( text )
}

// ******* import *******



// ******* export *******
const rect1 = new draw.Rect( {
	top: 100,
	left: 100,
	fill: 'red',
	width: 100,
	height: 100,
	angle: 0,
} )

const rect2 = new draw.Rect( {
	top: 150,
	left: 150,
	fill: 'blue',
	width: 100,
	height: 100,
	angle: 0,
} )

const rect3 = new draw.Rect( {
	top: 200,
	left: 200,
	fill: 'purple',
	width: 100,
	height: 100,
	angle: 0,
} )


draw.addElement( rect1 )
draw.addElement( rect2 )
draw.addElement( rect3 )

draw.render()

document.getElementById( 'exportBtn' ).addEventListener( 'click', function () {
	draw.exportData()
} )

// ******* export *******

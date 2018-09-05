const draw = new Draw( document.getElementById( 'canvas' ) )
const uploadButton = document.getElementById( 'uploadButton' )


draw.addElement( 'rect', {
	left  : 100,
	top   : 80,
	width : 100,
	height: 120,
} )

draw.addElement( "polygon", {
	points            : trianglePoints( { x: 200, y: 30 } ),
	curveUsesCanvasApi: true,
} )

draw.render()

function onFileInputChange( callback ) {
    try {
        const reader = new FileReader()
        function onReaderLoad( event ) {
            uploadButton.value = ''
            callback( event.target.result )
        }
        reader.onload = onReaderLoad
        reader.readAsText( event.target.files[ 0 ] )
    } catch ( e ) {

    }
}


function callback( text ) {
	draw.importData( text )
}

window[ 'onFileInputChange' ] = onFileInputChange
window[ 'callback' ] = callback



function trianglePoints( origin = {} ) {
	const { x = 0, y = 0 } = origin
	return [
		{
			x: 100,
			y: 50
		},
		{
			x: 150,
			y: 150
		},
		{
			x: 50,
			y: 150
		}
	].map( ( { x: px, y: py } ) => ( { x: px + x, y: py + y } ) )
}

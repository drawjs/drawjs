const draw = new Draw( document.getElementById( 'canvas' ) )

function onFileInputChange( callback ) {
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


function callback( text ) {
	draw.importData( text )
}

window[ 'onFileInputChange' ] = onFileInputChange
window[ 'callback' ] = callback

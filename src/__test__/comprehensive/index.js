const draw = new Draw( document.getElementById( "canvas" ) )

// // ******* import *******
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

// // ******* import *******

// ******* export *******
draw.addElement( "polygon", {
	left     : 350,
	top      : 250,
	fill     : "blue",
	width    : 100,
	height   : 100,
	angle    : 10,
	points   : polygon(),
	rotatable: true
} )

draw.addElement( "polygon", {
	left     : 550,
	top      : 550,
	fill     : "blue",
	width    : 100,
	height   : 100,
	angle    : 10,
	points   : polygon2(),
	rotatable: true
} )


// draw.addElement( 'rect', {
// 	left  : 350,
// 	top   : 250,
// 	fill  : 'red',
// 	width : 100,
// 	height: 100,
// 	angle : 0,
// } )

// draw.addElement( 'point', {
// 	x: 400,
// 	y: 300,
// 	color: 'blue',
// } )

// draw.addElement( 'point', {
// 	x: 400,
// 	y: -100,
// 	color: 'blue',
// } )

// draw.addElement( 'line', {
// 	pointStart: {
// 		x: 300,
// 		y: 300,
// 	},
// 	pointEnd: {
// 		x: 350,
// 		y: 350
// 	},
// 	fill: 'blue',
// } )

// draw.zoomPan.zoom = 2

// draw.addElement( 'rect-image', {
// 	left  : 350,
// 	top   : 250,
// 	fill  : 'red',
// 	width : 100,
// 	height: 100,
// 	angle : 0,
// 	src: '../../asset/tmp.png'
// } )

draw.render()

document.getElementById( "exportBtn" ).addEventListener( "click", function() {
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

function polygon() {
	const basicOrigin = {
		x: 100,
		y: 100
	}

	return [
		{
			x: basicOrigin.x + 100,
			y: basicOrigin.y + 10
		},
		{
			x: basicOrigin.x + 150,
			y: basicOrigin.y + 10
		},
		{
			x: basicOrigin.x + 200,
			y: basicOrigin.y + 100
		},
		{
			x: basicOrigin.x + 150,
			y: basicOrigin.y + 200
		},
		{
			x: basicOrigin.x + 100,
			y: basicOrigin.y + 200
		},
		{
			x: basicOrigin.x + 50,
			y: basicOrigin.y + 100
		}
	]
}

function polygon2() {
	const basicOrigin = {
		x: 300,
		y: 300
	}

	return [
		{
			x: basicOrigin.x + 100,
			y: basicOrigin.y + 10
		},
		{
			x: basicOrigin.x + 150,
			y: basicOrigin.y + 10
		},
		{
			x: basicOrigin.x + 200,
			y: basicOrigin.y + 100
		},
		{
			x: basicOrigin.x + 150,
			y: basicOrigin.y + 200
		},
		{
			x: basicOrigin.x + 100,
			y: basicOrigin.y + 200
		},
		{
			x: basicOrigin.x + 50,
			y: basicOrigin.y + 100
		}
	]
}

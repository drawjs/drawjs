const draw = new Draw( document.getElementById( 'canvas' ) )

// draw.addElement( 'rect', {
// 	top   : 100,
// 	left  : 100,
// 	fill  : 'red',
// 	width : 100,
// 	height: 100,
// 	angle : 0,
// } )

// draw.addElement( "polygon", {
// 	fill     : "blue",
// 		// angle    : 0,
// 		points   : triangle(),
// 		rotatable: true,
// 		sizable  : true,
// 		// showHandle: true,
// 		// draggable : false,
// 		// curveUsesCanvasApi: true,
// 		curveRate: 0.2,
// 	// kX: 1,
// 	// kY: 1
// } )

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


draw.render()

draw.exportData()


function triangle() {
	return [
		{
			x: 600,
			y: 150
		},
		{
			x: 650,
			y: 250
		},
		{
			x: 550,
			y: 250
		}
	]
}

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

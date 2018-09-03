const draw = new Draw( document.getElementById( 'canvas' ) )

draw.addElement( 'rect', {
	top   : 100,
	left  : 100,
	fill  : 'red',
	width : 100,
	height: 100,
	angle : 0,
} )

draw.addElement( "polygon", {
	fill     : "blue",
		// angle    : 0,
		points   : triangle(),
		rotatable: true,
		sizable  : true,
		// showHandle: true,
		// draggable : false,
		// curveUsesCanvasApi: true,
		curveRate: 0.2,
	// kX: 1,
	// kY: 1
} )

draw.addElement( "polyline", {
	points: [
		{
			x: 100,
			y: 100
		},
		{
			x: 300,
			y: 300
		},
		{
			x: 500,
			y: 300
		},
		{
			x: 350,
			y: 500,
		}
	]
} )


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
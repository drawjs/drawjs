const draw = new Draw( document.getElementById( "canvas" ) )

draw.addElement( "point", {
	x: 300,
	y: 300,
	fill: 'blue'
} )

// draw.getters.viewPort.zoomBy( {
// 	x: 400,
// 	y: 300
// }, 1 )

draw.render()

const draw = new Draw( document.getElementById( "canvas" ) )

draw.addElement( "point", {
	x: 300,
	y: 300,
	fill: 'blue'
} )

draw.render()

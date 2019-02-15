const draw = new Draw( document.getElementById( "canvas" ) )


draw.addElement( "curve", {
	points: [
		{ x: 100, y: 100 },
		{ x: 200, y: 200 },
	]
} )
draw.render()

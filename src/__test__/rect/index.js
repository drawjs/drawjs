const draw = new Draw( document.getElementById( 'canvas' ) )

const rect = new draw.Rect( {
	top: 100,
	left: 100,
	fill: 'red',
	width: 100,
	height: 100,
	angle: 0,
} )


draw.addElement( rect )

draw.addElement( new draw.Rect( {
	top: 150,
	left: 150,
	fill: 'blue',
	width: 100,
	height: 100,
	angle: 0,
} ) )

draw.render()

draw.exportData()

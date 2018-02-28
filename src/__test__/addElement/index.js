const draw = new Draw( document.getElementById( 'canvas' ) )

draw.addElement( 'rect', {
	left  : 350,
	top   : 250,
	fill  : 'red',
	width : 100,
	height: 100,
	angle : 0,
} )

draw.render()

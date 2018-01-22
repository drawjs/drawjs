const draw = new Draw( document.getElementById( 'canvas' ) )


const rect1 = new draw.Rect( {
	top   : 100,
	left  : 100,
	fill  : 'blue',
	width : 100,
	height: 100,
	angle : 0,
} )

draw.addElement( rect1 )

draw.render()

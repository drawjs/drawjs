const draw = new Draw( document.getElementById( 'canvas' ) )


const rect1 = new draw.Rect( {
	top   : 100,
	left  : 100,
	fill  : 'blue',
	width : 100,
	height: 100,
	angle : 0,
} )


const rect2 = new draw.Rect( {
	top   : 150,
	left  : 150,
	fill  : 'red',
	width : 100,
	height: 100,
	angle : 0,
} )

const rect3 = new draw.Rect( {
	top   : 200,
	left  : 200,
	fill  : 'orange',
	width : 100,
	height: 100,
	angle : 0,
} )

draw.addElement( rect1 )
draw.addElement( rect2 )
draw.addElement( rect3 )

draw.render()

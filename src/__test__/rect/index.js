const draw = new Draw( document.getElementById( 'canvas' ) )

const rect = new draw.Rect( {
	top: 100,
	left: 100,
	fill: 'red',
	width: 100,
	height: 100,
	angle: 100,
} )


draw.add( rect )

draw.add( new draw.Rect( {
	top: 200,
	left: 200,
	fill: 'blue',
	width: 100,
	height: 100,
	angle: 100,
} ) )

draw.render()

const a = 123
setInterval( () => {
	console.log( a )
}, 1000 )

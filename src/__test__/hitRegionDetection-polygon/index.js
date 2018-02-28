const draw = new Draw( document.getElementById( "canvas" ) )

draw.addElement( "polygon", {
	left  : 350,
	top   : 250,
	fill  : "red",
	width : 100,
	height: 100,
	angle : 0,
	points: [
		{
			x: 10,
			y: 10
		},
		// {
		// 	x: 300,
		// 	y: 10
		// },
		// {
		// 	x: 300,
		// 	y: 300
		// },
		// {
		// 	x: 100,
		// 	y: 300
		// },
		randomPoint(),
		randomPoint(),
		randomPoint(),
		randomPoint(),
		randomPoint(),
		randomPoint(),
		randomPoint(),
	]
} )

draw.render()


function randomPoint() {
	return {
		x: Math.random() * 500,
		y: Math.random() * 500,
	}
}

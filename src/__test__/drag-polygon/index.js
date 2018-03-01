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
			x: 100,
			y: 10
		},
		{
			x: 150,
			y: 10
		},
		{
			x: 200,
			y: 100
		},
		{
			x: 150,
			y: 200
		},
		{
			x: 100,
			y: 200
		},
		{
			x: 50,
			y: 100
		},
	]
} )

draw.render()


function randomPoint() {
	return {
		x: Math.random() * 500,
		y: Math.random() * 500,
	}
}

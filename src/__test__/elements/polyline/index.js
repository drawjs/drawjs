const draw = new Draw( document.getElementById( "canvas" ) )

const instance1 = draw.addElement( "polyline", {
	points: [
		{
			x: 100,
			y: 100
		},
		{
			x: 300,
			y: 300
		},
		{
			x: 500,
			y: 600
		}
	]
} )

draw.render()

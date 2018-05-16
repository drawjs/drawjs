const draw = new Draw( document.getElementById( "canvas" ) )

const instance1 = draw.addElement( "orthogonal-line", {
	points: [
		{
			x: 100,
			y: 100
		},
		{
			x: 200,
			y: 100
		},
		{
			x: 200,
			y: 200
		},
	]
} )


draw.render()

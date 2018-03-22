const draw = new Draw( document.getElementById( "canvas" ) )

const instance = draw.addElement( "line", {
	source: {
		x: 300,
		y: 300
	},
	target: {
		x: 400,
		y: 100
	}
} )

draw.render()

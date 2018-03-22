const draw = new Draw( document.getElementById( "canvas" ) )

const instance = draw.addElement( "line", {
	source: {
		x: 100,
		y: 100
	},
	target: {
		x: 300,
		y: 300
	}
} )

draw.render()

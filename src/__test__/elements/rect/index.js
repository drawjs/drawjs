const draw = new Draw( document.getElementById( "canvas" ) )

const instance1 = draw.addElement( "rect", {
	left  : 100,
	top   : 200,
	width : 300,
	height: 400
} )

draw.render()

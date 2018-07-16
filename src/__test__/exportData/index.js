const draw = new Draw( document.getElementById( 'canvas' ) )

const rect = draw.addElement( 'rect', {
	top   : 100,
	left  : 100,
	fill  : 'red',
	width : 100,
	height: 100,
	angle : 0,
} )

draw.render()

draw.exportData()
